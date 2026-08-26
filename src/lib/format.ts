/** Formatage propre au marché algérien. */

/** 7900 → "7 900 DA" (espace insécable fine avant l'unité). */
export function formatPrice(value: number): string {
  return `${value.toLocaleString("fr-DZ").replace(/\u202f|,/g, " ")}\u00a0DA`;
}

/** Pourcentage de remise arrondi, ou null s'il n'y en a pas. */
export function discountPercent(price: number, oldPrice?: number): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/** Vérifie un numéro algérien : 0[5-7]XXXXXXXX, avec ou sans espaces,
 *  accepte aussi +213 / 00213. */
export function isValidPhone(raw: string): boolean {
  const digits = raw.replace(/[\s.\-()]/g, "").replace(/^(\+213|00213)/, "0");
  return /^0[5-7]\d{8}$/.test(digits);
}

export function normalizePhone(raw: string): string {
  return raw.replace(/[\s.\-()]/g, "").replace(/^(\+213|00213)/, "0");
}

/** "2026-08-24" → "24 août 2026" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Référence de commande lisible : SU-260826-4821 */
export function orderReference(date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  const stamp = `${p(date.getDate())}${p(date.getMonth() + 1)}${String(date.getFullYear()).slice(2)}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SU-${stamp}-${rand}`;
}
