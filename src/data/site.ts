/** Paramètres de la boutique. Un seul endroit à modifier pour les tarifs de
 *  livraison, les coordonnées et les réseaux sociaux. */

export const SITE = {
  name: "EcomDZ",
  tagline: "Le shopping qui vous ressemble",
  description:
    "EcomDZ — la boutique e-commerce moderne et algérienne. Produits tendance, nouveautés et meilleures offres, livrés partout en Algérie. Paiement à la livraison.",
  url: "https://ecomdz.dz",
  locale: "fr_DZ",
  currency: "DA",
  phone: "0555 00 00 00",
  email: "contact@ecomdz.dz",
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
  { label: "Boutique", href: "/collections" },
  { label: "Catégories", href: "/#categories" },
  { label: "Promotions", href: "/#promotions" },
  { label: "À propos", href: "/a-propos" },
] as const;
