import type { NextConfig } from "next";

/**
 * NEXT_PUBLIC_GITHUB_PAGES=true est posé uniquement par le workflow de
 * déploiement (.github/workflows/deploy-pages.yml). En local, `npm run dev` /
 * `npm run build` tournent sans base path, normalement.
 *
 * Le préfixe NEXT_PUBLIC_ est indispensable : cette valeur doit aussi être
 * lisible par le code qui tourne dans le navigateur (le loader d'images
 * notamment, voir src/lib/image-loader.ts) — un `process.env` sans ce
 * préfixe n'est jamais inclus dans le bundle client par Next.js, il vaut
 * `undefined` une fois dans le navigateur même si le build serveur l'a bien
 * vu.
 */
const isGithubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";

/** Nom du dépôt : GitHub Pages sert un repo project page sous ce sous-chemin. */
const REPO_BASE_PATH = "/E-commerce-";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // GitHub Pages ne sert que des fichiers statiques : pas de serveur Next
  // pour l'optimisation d'image ou le rendu à la demande. `output: "export"`
  // pré-rend tout en HTML/CSS/JS dans out/.
  output: "export",
  basePath: isGithubPages ? REPO_BASE_PATH : "",
  assetPrefix: isGithubPages ? REPO_BASE_PATH : "",

  // un fichier statique par page (page/index.html) plutôt que page.html à
  // plat : c'est le format attendu par les routes internes de Next (données
  // de navigation *.txt) une fois servi sous un sous-dossier comme ici.
  trailingSlash: true,

  images: {
    // pas de serveur d'optimisation en export statique : un loader maison
    // se contente de préfixer le base path (voir src/lib/image-loader.ts).
    // `unoptimized: true` ferait pareil MAIS sans appliquer le base path,
    // ce qui casserait toutes les images sous GitHub Pages.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [360, 420, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [96, 128, 200, 256, 384, 512],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
