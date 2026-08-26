import type { CategorySlug, Product } from "@/lib/types";

/**
 * Catalogue STEP UP.
 *
 * Stock réel : 9 paires, une seule paire par pointure.
 *   McQUENNE Navy  → 40, 41, 42
 *   McQUENNE White → 40, 41
 *   McQUENNE Black → 39, 40, 41, 42
 *
 * Les trois fiches partagent la même silhouette : elles sont reliées entre
 * elles par `colors`, ce qui permet de passer d'un coloris à l'autre depuis
 * la fiche produit.
 */

/** Fin de la promotion en cours, commune aux trois coloris. Alimente le
 *  compte à rebours affiché sur la fiche produit. */
export const PROMO_ENDS_AT = "2026-08-31T23:59:59";

const COLORS = [
  { name: "Blanc / Marine", hex: "#F4F5F7", accentHex: "#1B2A5B", slug: "step-one-navy" },
  { name: "Blanc intégral", hex: "#F8FAFC", accentHex: "#E2E6EC", slug: "step-one-white" },
  { name: "Noir / Semelle blanche", hex: "#101216", accentHex: "#F1EFEA", slug: "step-one-black" },
];

function gallery(slug: string, alt: string) {
  return [
    {
      src: `/products/${slug}-main.webp`,
      src2x: `/products/${slug}-main@2x.webp`,
      alt: `${alt} — vue trois quarts`,
      width: 800,
      height: 1001,
    },
    {
      src: `/products/${slug}-detail-1.webp`,
      src2x: `/products/${slug}-detail-1@2x.webp`,
      alt: `${alt} — détail du contrefort et du col rembourré`,
      width: 700,
      height: 876,
    },
    {
      src: `/products/${slug}-detail-2.webp`,
      src2x: `/products/${slug}-detail-2@2x.webp`,
      alt: `${alt} — détail du laçage et de la semelle surélevée`,
      width: 700,
      height: 876,
    },
  ];
}

function cutout(slug: string, alt: string) {
  return {
    src: `/products/${slug}-cut.webp`,
    src2x: `/products/${slug}-cut@2x.webp`,
    alt,
    cutout: true,
    width: 900,
    height: 860,
  };
}

const DESCRIPTION_BASE =
  "Une silhouette basse à semelle surélevée, montée en cuir lisse et doublée d’un col rembourré. " +
  "La coupe reste nette et discrète : elle se porte aussi bien avec un jean droit qu’avec un pantalon " +
  "de costume. Semelle en gomme épaisse pour l’amorti, tige facile à nettoyer, tenue impeccable au fil " +
  "des lavages.";

const HIGHLIGHTS = [
  "Semelle surélevée 4 cm, gomme souple et antidérapante",
  "Col et languette rembourrés, laçage plat 7 œillets",
  "Cuir synthétique lisse, entretien à l’éponge humide",
  "Chausse standard — prenez votre pointure habituelle",
];

export const PRODUCTS: Product[] = [
  {
    id: "SU-001",
    name: "McQUENNE",
    subtitle: "Sneaker premium — Blanc / Marine",
    slug: "step-one-navy",
    category: "sneakers",
    type: "Sneakers basses",
    brand: "STEP UP",
    price: 1800,
    oldPrice: 3900,
    images: gallery("step-one-navy", "McQUENNE Blanc et Marine"),
    cutout: cutout("step-one-navy", "Sneaker McQUENNE blanche à contrefort bleu marine"),
    colors: COLORS,
    colorName: "Blanc / Marine",
    sizes: [
      { size: "40", stock: 1 },
      { size: "41", stock: 1 },
      { size: "42", stock: 1 },
    ],
    description:
      "Le coloris signature : une tige blanche relevée d’un contrefort bleu marine en daim. " +
      DESCRIPTION_BASE,
    highlights: HIGHLIGHTS,
    materials: "Tige en cuir synthétique · contrefort daim · semelle gomme",
    rating: 4.8,
    reviews: 124,
    badge: "bestseller",
    featured: true,
    createdAt: "2026-08-20",
  },
  {
    id: "SU-002",
    name: "McQUENNE",
    subtitle: "Sneaker premium — Blanc intégral",
    slug: "step-one-white",
    category: "sneakers",
    type: "Sneakers basses",
    brand: "STEP UP",
    price: 1800,
    oldPrice: 3900,
    images: gallery("step-one-white", "McQUENNE Blanc intégral"),
    cutout: cutout("step-one-white", "Sneaker McQUENNE entièrement blanche"),
    colors: COLORS,
    colorName: "Blanc intégral",
    sizes: [
      { size: "40", stock: 1 },
      { size: "41", stock: 1 },
    ],
    description:
      "Le blanc total, sans aucune rupture : la version la plus épurée du modèle. " +
      DESCRIPTION_BASE,
    highlights: HIGHLIGHTS,
    materials: "Tige en cuir synthétique · semelle gomme blanche",
    rating: 4.9,
    reviews: 86,
    badge: "nouveaute",
    featured: true,
    createdAt: "2026-08-22",
  },
  {
    id: "SU-003",
    name: "McQUENNE",
    subtitle: "Sneaker premium — Noir / Semelle blanche",
    slug: "step-one-black",
    category: "sneakers",
    type: "Sneakers basses",
    brand: "STEP UP",
    price: 1800,
    oldPrice: 3900,
    images: gallery("step-one-black", "McQUENNE Noir et semelle blanche"),
    cutout: cutout("step-one-black", "Sneaker McQUENNE noire à semelle blanche"),
    colors: COLORS,
    colorName: "Noir / Semelle blanche",
    sizes: [
      { size: "39", stock: 1 },
      { size: "40", stock: 1 },
      { size: "41", stock: 1 },
      { size: "42", stock: 1 },
    ],
    description:
      "Tige noire mate contrastée par une semelle blanc cassé : le coloris le plus polyvalent, " +
      "celui qui se salit le moins. " + DESCRIPTION_BASE,
    highlights: HIGHLIGHTS,
    materials: "Tige en cuir synthétique mat · semelle gomme blanc cassé",
    rating: 4.7,
    reviews: 63,
    badge: "nouveaute",
    featured: true,
    createdAt: "2026-08-24",
  },
];

export interface CategoryInfo {
  slug: CategorySlug;
  label: string;
  href: string;
  title: string;
  description: string;
  /** visuel de la vignette catégorie */
  image: string;
  image2x?: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "sneakers",
    label: "Sneakers",
    href: "/sneakers",
    title: "Sneakers",
    description:
      "Des silhouettes basses, sobres et bien construites. Chaque paire est sélectionnée à l’unité, " +
      "essayée et contrôlée avant d’être mise en ligne.",
    image: "/products/step-one-navy-cut.webp",
    image2x: "/products/step-one-navy-cut@2x.webp",
  },
  {
    slug: "vetements",
    label: "Vêtements",
    href: "/vetements",
    title: "Vêtements",
    description:
      "T-shirts, hoodies, sweats, pantalons et vestes. La première sélection arrive prochainement.",
    image: "/products/step-one-black-cut.webp",
    image2x: "/products/step-one-black-cut@2x.webp",
  },
  {
    slug: "accessoires",
    label: "Accessoires",
    href: "/accessoires",
    title: "Accessoires",
    description:
      "Chaussettes, sacs, casquettes et entretien. La première sélection arrive prochainement.",
    image: "/products/step-one-white-cut.webp",
    image2x: "/products/step-one-white-cut@2x.webp",
  },
];

/** Sous-familles prévues pour la page Vêtements (filtres déjà en place). */
export const CLOTHING_TYPES = [
  "T-shirts",
  "Hoodies",
  "Sweats",
  "Pantalons",
  "Vestes",
  "Ensembles",
];
