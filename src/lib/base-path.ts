/**
 * Préfixe un chemin absolu avec le base path du déploiement en cours.
 *
 * `next/image` et `next/link` gèrent déjà automatiquement `basePath`. Cette
 * fonction ne sert que pour les rares chemins écrits en chaîne brute, hors de
 * ces deux composants (ex. `manifest.ts`), qui ne bénéficient pas de ce
 * traitement automatique.
 */
export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true" ? "/E-commerce-" : "";
  return `${base}${path}`;
}
