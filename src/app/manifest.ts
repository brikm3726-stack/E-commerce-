import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";
import { withBasePath } from "@/lib/base-path";

/** requis par `output: "export"` : ces routes de metadonnees sont figees au build. */
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — Sneakers & streetwear premium`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: withBasePath("/"),
    display: "standalone",
    background_color: "#02040A",
    theme_color: "#02040A",
    lang: "fr",
    categories: ["shopping", "lifestyle"],
    icons: [
      { src: withBasePath("/icon.svg"), sizes: "any", type: "image/svg+xml" },
      { src: withBasePath("/apple-icon.png"), sizes: "180x180", type: "image/png" },
    ],
  };
}
