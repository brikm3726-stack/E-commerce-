import { PRODUCTS, CATEGORIES, type CategoryInfo } from "@/data/products";
import type { CategorySlug, Product } from "@/lib/types";

/**
 * Accès au catalogue. Toute la lecture produits passe par ici : le jour où le
 * catalogue vient de Supabase ou d'une API, seules ces fonctions changent
 * (elles deviennent async), les composants gardent la même signature.
 */

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getByCategory(category: CategorySlug): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getFeatured(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

/** Nouveautés : les plus récentes d'abord. */
export function getNewArrivals(limit?: number): Product[] {
  const sorted = [...PRODUCTS].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Autres coloris du même modèle (hors fiche courante). */
export function getRelated(product: Product, limit = 4): Product[] {
  const siblings = product.colors
    .map((c) => getProduct(c.slug))
    .filter((p): p is Product => !!p && p.slug !== product.slug);
  if (siblings.length >= limit) return siblings.slice(0, limit);
  const others = PRODUCTS.filter(
    (p) => p.slug !== product.slug && !siblings.some((s) => s.slug === p.slug),
  );
  return [...siblings, ...others].slice(0, limit);
}

export function getCategory(slug: CategorySlug): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function totalStock(product: Product): number {
  return product.sizes.reduce((sum, s) => sum + s.stock, 0);
}

export function isInStock(product: Product): boolean {
  return totalStock(product) > 0;
}

export function stockForSize(product: Product, size: string): number {
  return product.sizes.find((s) => s.size === size)?.stock ?? 0;
}

/** Toutes les pointures présentes dans le catalogue, triées. */
export function allSizes(products: Product[] = PRODUCTS): string[] {
  const set = new Set<string>();
  products.forEach((p) => p.sizes.forEach((s) => set.add(s.size)));
  return [...set].sort((a, b) => Number(a) - Number(b));
}

/** Tous les coloris présents, dédupliqués par nom. */
export function allColors(products: Product[] = PRODUCTS) {
  const map = new Map<string, { name: string; hex: string; accentHex?: string }>();
  products.forEach((p) => {
    const c = p.colors.find((c) => c.name === p.colorName);
    if (c && !map.has(c.name)) map.set(c.name, { name: c.name, hex: c.hex, accentHex: c.accentHex });
  });
  return [...map.values()];
}

export function priceRange(products: Product[] = PRODUCTS): [number, number] {
  if (!products.length) return [0, 0];
  const prices = products.map((p) => p.price);
  return [Math.min(...prices), Math.max(...prices)];
}

/** Recherche plein texte simple, tolérante aux accents. */
export function searchProducts(query: string, limit = 8): Product[] {
  const q = normalize(query);
  if (q.length < 1) return [];
  return PRODUCTS.map((p) => {
    const haystack = normalize(
      [p.name, p.subtitle, p.colorName, p.type, p.brand, p.category, p.description].join(" "),
    );
    let score = 0;
    if (normalize(p.name).startsWith(q)) score += 10;
    if (normalize(p.colorName).includes(q)) score += 6;
    if (normalize(p.type).includes(q)) score += 4;
    if (haystack.includes(q)) score += 2;
    // recherche par mots : "sneaker noire" doit trouver le coloris noir
    const words = q.split(/\s+/).filter(Boolean);
    if (words.length > 1 && words.every((w) => haystack.includes(w))) score += 5;
    return { p, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.p);
}

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}
