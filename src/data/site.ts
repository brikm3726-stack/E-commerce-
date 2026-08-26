/** Paramètres de la boutique. Un seul endroit à modifier pour les tarifs de
 *  livraison, les coordonnées et les réseaux sociaux. */

export const SITE = {
  name: "STEP UP",
  tagline: "L’élégance au quotidien",
  description:
    "Sneakers et streetwear premium sélectionnés en Algérie. Paiement à la livraison, 58 wilayas, échange sous 48h.",
  url: "https://stepup.dz",
  locale: "fr_DZ",
  currency: "DA",
  phone: "0555 00 00 00",
  email: "contact@stepup.dz",
  city: "Alger, Algérie",
  social: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    facebook: "https://facebook.com/",
  },
  /** WhatsApp au format international, sans + ni espaces */
  whatsapp: "213555000000",
} as const;

export const SHIPPING = {
  /** livraison à domicile */
  domicile: 600,
  /** retrait au bureau du transporteur */
  bureau: 400,
  /** livraison offerte à partir de ce montant */
  freeFrom: 15000,
} as const;

export const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Sneakers", href: "/sneakers" },
  { label: "Vêtements", href: "/vetements" },
  { label: "Nouveautés", href: "/nouveautes" },
  { label: "Collections", href: "/collections" },
  { label: "À propos", href: "/a-propos" },
] as const;
