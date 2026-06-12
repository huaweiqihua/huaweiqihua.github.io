import type { Platform } from "@/lib/types";

export interface AccessIssue {
  code: "auth_required" | "anti_bot" | "shortlink_failed";
  message: string;
}

export interface AccessIssueInput {
  platform: Platform;
  finalUrl: string;
  title: string;
  bodyText: string;
  errorMessage?: string;
}

export interface PageCandidate {
  href: string;
  text: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  containerText?: string | null;
  isStoreItem?: boolean;
}

export interface CrawledListing {
  platform: Platform;
  title: string;
  productUrl: string;
  imageUrl: string;
  priceAmount: number | null;
  priceCurrency: string;
  ratingAverage: number | null;
  reviewCount: number;
  soldCount?: number;
  reviewSnippets: string[];
}

export interface ExtractListingsInput {
  platform: Platform;
  pageUrl: string;
  candidates: PageCandidate[];
}

const authSignals = [
  "sign in / register",
  "please enter your email",
  "log in",
  "login",
  "sign in to",
  "continue with google",
  "continue with facebook"
];

const antiBotSignals = [
  "captcha",
  "security check",
  "verify you are human",
  "unusual traffic",
  "access denied",
  "too many requests",
  "blocked"
];

function marketplaceName(platform: Platform) {
  return platform === "tiktok" ? "TikTok Shop" : "Temu";
}

export function detectAccessIssue(input: AccessIssueInput): AccessIssue | null {
  const normalizedText = `${input.title}\n${input.bodyText}\n${input.errorMessage ?? ""}`.toLowerCase();
  const finalUrl = input.finalUrl.toLowerCase();

  if (input.platform === "temu" && finalUrl.includes("/login")) {
    return {
      code: "auth_required",
      message: `${marketplaceName(input.platform)} returned a login page. Save a Playwright storage state for this platform before live sync.`
    };
  }

  if (authSignals.some((signal) => normalizedText.includes(signal))) {
    return {
      code: "auth_required",
      message: `${marketplaceName(input.platform)} requires a logged-in session before product extraction.`
    };
  }

  if (antiBotSignals.some((signal) => normalizedText.includes(signal))) {
    return {
      code: "anti_bot",
      message: `${marketplaceName(input.platform)} presented an anti-bot or verification page. Manual review is required.`
    };
  }

  if (input.platform === "tiktok" && input.errorMessage?.includes("ERR_ABORTED")) {
    return {
      code: "shortlink_failed",
      message: "TikTok short link navigation was aborted before the destination page could be resolved."
    };
  }

  return null;
}

function isProductHref(platform: Platform, href: string) {
  const normalizedHref = href.toLowerCase();

  if (platform === "temu") {
    return normalizedHref.includes("goods.html") || normalizedHref.includes("goods_id=") || /-g-\d+\.html(?:$|[?#])/.test(normalizedHref);
  }

  return (
    normalizedHref.includes("/shop/pdp") ||
    normalizedHref.includes("/shop/product") ||
    normalizedHref.includes("/product/")
  );
}

function cleanLine(line: string) {
  return line.replace(/\s+/g, " ").trim();
}

function isLikelyTitle(line: string) {
  const normalizedLine = cleanLine(line);

  if (normalizedLine.length < 6 || normalizedLine.length > 320) {
    return false;
  }

  if (/^(\$|us\$|usd|\d+(\.\d+)?$)/i.test(normalizedLine)) {
    return false;
  }

  if (/^(sold|reviews?|ratings?|free shipping|top|new)$/i.test(normalizedLine)) {
    return false;
  }

  return /[a-z0-9]/i.test(normalizedLine);
}

function cleanTitleCandidate(value: string) {
  return cleanLine(value)
    .replace(/^top pick\s*/i, "")
    .replace(/^item picture\s*/i, "")
    .replace(/(?:US\$|\$|USD\s*|£|GBP\s*)\d{1,5}(?:[,.]\d{1,2})?.*$/i, "")
    .replace(/\s*open in new tab\.?$/i, "")
    .trim();
}

function pickTitle(candidate: PageCandidate) {
  const titleCandidates = [
    candidate.text,
    candidate.imageAlt ?? "",
    ...(candidate.containerText ?? "").split(/\n+/)
  ].map(cleanTitleCandidate);

  return titleCandidates.find(isLikelyTitle) ?? "";
}

function parsePrice(text: string) {
  const match = text.match(/(?:US\$|\$|USD\s*|£|GBP\s*)(\d{1,5}(?:[,.]\d{1,2})?)/i);

  if (!match) {
    return null;
  }

  return Number(match[1].replace(",", "."));
}

function parseCurrency(text: string) {
  if (/(?:£|GBP\s*)\d/i.test(text)) {
    return "GBP";
  }

  return "USD";
}

function parseRating(text: string) {
  const match = text.match(/\b([1-5](?:\.\d)?)\s*(?:\/\s*5|stars?|rating)\b/i);

  if (!match) {
    return null;
  }

  const rating = Number(match[1]);
  return rating >= 1 && rating <= 5 ? rating : null;
}

function parseReviewCount(text: string) {
  const metricText = stripPriceText(text);
  const match = metricText.match(/(\d[\d,.]*\s*[KkMm]?\+?)\s*(?:reviews?|ratings?)/i);

  if (!match) {
    return 0;
  }

  return parseHumanCount(match[1]);
}

function parseHumanCount(value: string) {
  const normalizedValue = value.replace(/,/g, "").replace("+", "").trim();
  const match = normalizedValue.match(/^(\d+(?:\.\d+)?)([KkMm])?$/);

  if (!match) {
    return 0;
  }

  const amount = Number(match[1]);
  const suffix = match[2]?.toLowerCase();

  if (suffix === "m") {
    return Math.round(amount * 1_000_000);
  }

  if (suffix === "k") {
    return Math.round(amount * 1_000);
  }

  return Math.round(amount);
}

function parseSoldCount(text: string) {
  const metricText = stripPriceText(text);
  const match = metricText.match(/(\d[\d,.]*\s*[KkMm]?\+?)\s*sold/i);

  if (!match) {
    return undefined;
  }

  return parseHumanCount(match[1]);
}

function stripPriceText(text: string) {
  return text.replace(/(?:US\$|\$|USD\s*|£|GBP\s*)\d{1,5}(?:[,.]\d{1,2})?/gi, " ");
}

function extractReviewSnippets(text: string) {
  return text
    .split(/\n+/)
    .map(cleanLine)
    .filter((line) => line.length >= 24 && line.length <= 180)
    .filter((line) => /good|great|love|clean|amazing|perfect|quality|excellent|nice|well/i.test(line))
    .slice(0, 3);
}

function normalizeAbsoluteUrl(url: string, pageUrl: string) {
  try {
    return new URL(url, pageUrl).toString();
  } catch {
    return url;
  }
}

export function extractListingsFromCandidates(input: ExtractListingsInput): CrawledListing[] {
  const seenUrls = new Set<string>();
  const listings: CrawledListing[] = [];

  for (const candidate of input.candidates) {
    const productUrl = normalizeAbsoluteUrl(candidate.href, input.pageUrl);
    const imageUrl = candidate.imageUrl ? normalizeAbsoluteUrl(candidate.imageUrl, input.pageUrl) : "";
    const containerText = candidate.containerText ?? candidate.text;
    const title = pickTitle(candidate);

    if (!isProductHref(input.platform, productUrl) || !title || !imageUrl || seenUrls.has(productUrl)) {
      continue;
    }

    seenUrls.add(productUrl);
    listings.push({
      platform: input.platform,
      title,
      productUrl,
      imageUrl,
      priceAmount: parsePrice(containerText),
      priceCurrency: parseCurrency(containerText),
      ratingAverage: parseRating(containerText),
      reviewCount: parseReviewCount(containerText),
      soldCount: parseSoldCount(containerText),
      reviewSnippets: extractReviewSnippets(containerText)
    });
  }

  return listings;
}
