import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/catalog";
import { HELP_TOPICS } from "@/data/help";
import { SITE } from "@/data/site";

/** requis par `output: "export"` : ces routes de metadonnees sont figees au build. */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/sneakers`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/nouveautes`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/collections`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/vetements`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE.url}/accessoires`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE.url}/a-propos`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const products: MetadataRoute.Sitemap = getAllProducts().map((product) => ({
    url: `${SITE.url}/produit/${product.slug}`,
    lastModified: new Date(product.createdAt),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const help: MetadataRoute.Sitemap = HELP_TOPICS.map((topic) => ({
    url: `${SITE.url}/aide/${topic.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...products, ...help];
}
