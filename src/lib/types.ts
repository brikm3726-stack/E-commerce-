/** Modele de donnees du catalogue. Volontairement proche d'un schema SQL :
 *  brancher Supabase / une API revient a remplacer src/lib/catalog.ts,
 *  sans toucher aux composants. */

export type CategorySlug = "sneakers" | "vetements" | "accessoires";

export type BadgeKind = "nouveaute" | "promo" | "bestseller" | "derniere-paire";

/** Une taille et le stock reellement disponible pour cette taille. */
export interface SizeStock {
  size: string;
  stock: number;
}

/** Un coloris : sert aussi de lien entre les fiches d'un meme modele. */
export interface ColorOption {
  name: string;
  /** couleur dominante affichee dans la pastille */
  hex: string;
  /** seconde couleur (semelle, contrefort) pour une pastille bicolore */
  accentHex?: string;
  /** slug du produit correspondant a ce coloris */
  slug: string;
}

export interface ProductImage {
  src: string;
  /** version haute resolution pour le zoom / les grands ecrans */
  src2x?: string;
  alt: string;
  /** visuel a fond fondu, utilise en hero et sur les cartes */
  cutout?: boolean;
  width: number;
  height: number;
}

export interface Product {
  id: string;
  name: string;
  /** ligne secondaire affichee sous le nom */
  subtitle: string;
  slug: string;
  category: CategorySlug;
  /** sous-famille : "Sneakers basses", "T-shirts"... sert aux filtres */
  type: string;
  brand: string;
  price: number;
  oldPrice?: number;
  images: ProductImage[];
  /** visuel principal a fond fondu (hero, cartes, favoris) */
  cutout: ProductImage;
  colors: ColorOption[];
  /** coloris de CETTE fiche, doit exister dans colors */
  colorName: string;
  sizes: SizeStock[];
  description: string;
  /** arguments produits affiches en liste sur la fiche */
  highlights: string[];
  materials: string;
  rating: number;
  reviews: number;
  badge?: BadgeKind;
  /** mise en avant sur la page d'accueil */
  featured?: boolean;
  createdAt: string;
}

/** Ligne de panier : un produit + une taille precise. */
export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  subtitle: string;
  colorName: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
  /** stock restant pour cette taille, borne la quantite */
  maxQuantity: number;
}

export type DeliveryMode = "domicile" | "bureau";

export type PaymentMethod = "cod" | "cib" | "edahabia";

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  note?: string;
}

export interface Order {
  reference: string;
  createdAt: string;
  customer: OrderCustomer;
  delivery: DeliveryMode;
  payment: PaymentMethod;
  lines: CartLine[];
  subtotal: number;
  shipping: number;
  total: number;
}
