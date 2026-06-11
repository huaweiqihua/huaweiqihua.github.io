import type { MetadataRoute } from "next";
import { listVisibleProducts } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

function updatedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: absoluteUrl("/about"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4
    },
    {
      url: absoluteUrl("/shipping-note"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4
    }
  ];

  const productPages: MetadataRoute.Sitemap = listVisibleProducts().map((product) => ({
    url: absoluteUrl(`/products/${product.slug}`),
    lastModified: updatedAt(product.updatedAt),
    changeFrequency: "daily",
    priority: 0.8
  }));

  return [...staticPages, ...productPages];
}
