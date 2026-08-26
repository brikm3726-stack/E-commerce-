import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";

/** requis par `output: "export"` : ces routes de metadonnees sont figees au build. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // pages personnelles : inutiles à indexer
        disallow: ["/panier", "/commande", "/favoris", "/compte"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
