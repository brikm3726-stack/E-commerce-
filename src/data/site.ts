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
  phone: "0792 77 93 20",
  email: "contact@ecomdz.dz",
  city: "Alger, Algérie",
  social: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    facebook: "https://facebook.com/",
  },
  /** WhatsApp au format international, sans + ni espaces.
   *  0792 77 93 20 → on retire le 0 initial et on préfixe par 213. */
  whatsapp: "213792779320",
} as const;

/**
 * Clé Web3Forms — c'est elle qui fait arriver les commandes dans la boîte mail.
 *
 * À récupérer gratuitement sur https://web3forms.com en saisissant l'adresse
 * e-mail de réception : la clé arrive aussitôt, sans e-mail d'activation, et
 * l'adresse n'apparaît jamais dans le code. 250 envois par mois.
 *
 * Cette clé est PUBLIQUE par conception (le navigateur du client s'en sert),
 * elle n'a donc pas à être cachée dans un secret de dépôt.
 *
 * Tant qu'elle est vide, aucune commande n'est envoyée : le client voit sa
 * confirmation, mais rien n'arrive dans la boîte mail.
 */
export const WEB3FORMS_KEY = "2d63f702-d3aa-484b-8699-575c241c7120";

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
