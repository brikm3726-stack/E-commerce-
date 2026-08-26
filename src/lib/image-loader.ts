/**
 * Loader d'images pour `next/image` en export statique (`output: "export"`).
 *
 * Sans serveur Next, il n'y a pas d'optimisation à la demande : ce loader se
 * contente de préfixer le chemin avec le base path du déploiement (GitHub
 * Pages sert ce dépôt sous `/E-commerce-`). Nos visuels sont déjà pré-générés
 * aux bonnes tailles par `tools/prepare-images.py`, `width`/`quality` sont
 * donc ignorés sans perte.
 *
 * Important : `images.unoptimized` ne doit PAS être activé en même temps que
 * ce loader — Next ignore alors le loader et sert `src` tel quel, sans le
 * base path, ce qui casse toutes les images une fois déployé sous un
 * sous-chemin.
 */
export default function imageLoader({ src }: { src: string; width: number; quality?: number }): string {
  const base = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true" ? "/E-commerce-" : "";
  return `${base}${src}`;
}
