import Link from "next/link";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/data/site";

const COLUMNS = [
  {
    title: "Boutique",
    links: [
      { label: "Toute la boutique", href: "/collections" },
      { label: "Sneakers", href: "/sneakers" },
      { label: "Catégories", href: "/#categories" },
      { label: "Promotions", href: "/#promotions" },
      { label: "À propos", href: "/a-propos" },
    ],
  },
  {
    title: "Aide",
    links: [
      { label: "Livraison", href: "/aide/livraison" },
      { label: "Retours & échanges", href: "/aide/retours" },
      { label: "Guide des tailles", href: "/aide/guide-des-tailles" },
      { label: "Questions fréquentes", href: "/aide/faq" },
      { label: "Suivi de commande", href: "/compte" },
    ],
  },
  {
    title: "La marque",
    links: [
      { label: "À propos", href: "/a-propos" },
      { label: "Contact", href: "/contact" },
      { label: "Instagram", href: SITE.social.instagram, external: true },
      { label: "TikTok", href: SITE.social.tiktok, external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line bg-ink-2">
      {/* trait lumineux au raccord */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-px h-px bg-gradient-to-r
          from-transparent via-accent-line to-transparent"
      />

      <div className="container-page py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          {/* ------------------------------------------------------ marque */}
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-2.5">
              <span
                className="grid size-8 place-items-center rounded-lg bg-[#1b1710]"
                aria-hidden="true"
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 4.5h9M3 8h9M3 11.5h6"
                    stroke="#f5b301"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="font-display text-lg font-extrabold tracking-[-0.03em]">
                <span className="text-fg">Ecom</span>
                <span className="text-accent-2">DZ</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-fg-2">
              La boutique e-commerce moderne et algérienne. Des produits tendance
              sélectionnés pour vous, livrés partout en Algérie.
            </p>

            <ul className="mt-6 space-y-2.5 text-sm text-fg-2">
              <li>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-fg"
                >
                  <Phone size={15} className="text-fg-3" />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-fg"
                >
                  <Mail size={15} className="text-fg-3" />
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={15} className="text-fg-3" />
                {SITE.city}
              </li>
            </ul>
          </div>

          {/* ----------------------------------------------------- colonnes */}
          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="eyebrow mb-4">{column.title}</h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline text-sm text-fg-2 transition-colors hover:text-fg"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="link-underline text-sm text-fg-2 transition-colors hover:text-fg"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ------------------------------------------------------ réassurance */}
        <div className="mt-12 grid gap-3 border-t border-line pt-8 sm:grid-cols-3">
          {[
            { title: "Livraison 58 wilayas", detail: "À domicile ou au bureau" },
            { title: "Paiement à la livraison", detail: "Vous payez à la réception" },
            { title: "Échange sous 48 h", detail: "Si la pointure ne va pas" },
          ].map((item) => (
            <div key={item.title}>
              <p className="text-[0.8125rem] font-semibold text-fg">{item.title}</p>
              <p className="text-xs text-fg-3">{item.detail}</p>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------------ bas */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-fg-3">
            © 2026 EcomDZ — Tous droits réservés. Livraison partout en Algérie.
          </p>

          <div className="flex items-center gap-3">
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid size-9 place-items-center rounded-md border border-line
                text-fg-2 transition-all duration-300 hover:border-accent-line hover:text-accent-2"
            >
              <Instagram size={16} />
            </a>
            <a
              href={SITE.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="grid size-9 place-items-center rounded-md border border-line
                text-fg-2 transition-all duration-300 hover:border-accent-line hover:text-accent-2"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .77-5.06V9.68a5.68 5.68 0 1 0 4.91 5.62V9.01a7.35 7.35 0 0 0 4.29 1.38V7.3a4.29 4.29 0 0 1-3.23-1.48Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
