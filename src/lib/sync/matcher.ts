interface MatchInput {
  tiktokTitle: string;
  temuTitle: string;
  tiktokImageUrl?: string;
  temuImageUrl?: string;
  tiktokPrice?: number | null;
  temuPrice?: number | null;
}

export interface MatchScore {
  score: number;
  reasons: string[];
}

const stopWords = new Set(["the", "a", "an", "with", "and", "for", "of", "new"]);

const synonyms = new Map([
  ["clear", "transparent"],
  ["assembly", "model"],
  ["ship", "carrier"],
  ["collectible", "figure"],
  ["toy", "figure"]
]);

export function normalizeTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((token) => synonyms.get(token) ?? token)
    .filter((token) => token && !stopWords.has(token))
    .join(" ");
}

function tokenize(title: string) {
  return new Set(normalizeTitle(title).split(" ").filter(Boolean));
}

function jaccard(left: Set<string>, right: Set<string>) {
  const intersection = [...left].filter((token) => right.has(token)).length;
  const union = new Set([...left, ...right]).size;

  return union === 0 ? 0 : intersection / union;
}

function imageKey(url?: string) {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    return parsed.pathname.split("/").filter(Boolean).pop() ?? parsed.pathname;
  } catch {
    return url;
  }
}

function priceCloseness(left?: number | null, right?: number | null) {
  if (!left || !right) {
    return 0;
  }

  const delta = Math.abs(left - right);
  const average = (left + right) / 2;
  return Math.max(0, 1 - delta / average);
}

export function scoreListingMatch(input: MatchInput): MatchScore {
  const titleScore = jaccard(tokenize(input.tiktokTitle), tokenize(input.temuTitle));
  const sameImage = imageKey(input.tiktokImageUrl) !== "" && imageKey(input.tiktokImageUrl) === imageKey(input.temuImageUrl);
  const priceScore = priceCloseness(input.tiktokPrice, input.temuPrice);
  const score = Number(Math.min(1, titleScore * 0.66 + (sameImage ? 0.22 : 0) + priceScore * 0.18).toFixed(2));
  const reasons: string[] = [];

  if (titleScore >= 0.35) {
    reasons.push("shared title tokens");
  }

  if (sameImage) {
    reasons.push("same image fingerprint");
  }

  if (priceScore >= 0.75) {
    reasons.push("close price range");
  }

  if (reasons.length === 0) {
    reasons.push("low similarity");
  }

  return { score, reasons };
}
