"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Décide si la page porte l'habillage du site (header, menus, pied de page).
 *
 * Les pages d'atterrissage publicitaires en sont dépourvues volontairement :
 * une campagne Facebook amène un visiteur pour UNE action — commander. Toute
 * navigation autour est une porte de sortie qui coûte des commandes.
 *
 * Le header et le pied de page restent rendus côté serveur : ils sont reçus en
 * `props`, ce composant ne fait que choisir de les afficher ou non.
 */
const BARE_ROUTES = ["/offre"];

export function SiteChrome({
  skipLink,
  header,
  footer,
  children,
}: {
  skipLink: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (bare) return <main id="contenu">{children}</main>;

  return (
    <>
      {skipLink}
      {header}
      <main id="contenu" className="pt-16 md:pt-18">
        {children}
      </main>
      {footer}
    </>
  );
}
