import { HUB_URL, HUB_LANDING_ID, HUB_PRODUCT_MAP } from "@/data/site";
import type { Order } from "@/lib/types";

/**
 * Envoi de la commande au hub central (dossier `ecom-hub`).
 *
 * Ce site est statique : il n'a pas de base de données et ne peut pas en avoir.
 * Le hub, lui, en a une. Chaque commande y est donc postée en plus de l'e-mail
 * Web3Forms, et devient consultable dans le dashboard, rattachée à son produit
 * et à sa landing page.
 *
 * Trois règles, les mêmes que pour `notifyOrder` :
 *
 * 1. `keepalive` — la requête doit survivre au changement de page qui suit la
 *    validation, sinon la commande est perdue en route.
 * 2. Ne JAMAIS faire attendre le client. L'appelant affiche la confirmation
 *    tout de suite et laisse cette fonction se terminer en arrière-plan.
 * 3. Ne jamais lever. Le hub indisponible ne doit pas casser la commande :
 *    l'e-mail Web3Forms reste le filet, il part en parallèle.
 *
 * Tant que `HUB_URL` est vide dans src/data/site.ts, cette fonction ne fait
 * rien du tout — le site se comporte exactement comme avant.
 */

const TIMEOUT_MS = 12_000;

export type HubResult =
  /** enregistrée dans le hub */
  | "saved"
  /** hub non configuré : HUB_URL est vide */
  | "disabled"
  /** réseau coupé, délai dépassé, ou commande refusée */
  | "failed";

/**
 * @param source d'où vient la commande — « Page pub arabe » ou « Site ».
 * @param landingId identifiant de la landing page dans le hub. Par défaut
 *   celui de la page publicitaire ; le tunnel du site passe le sien.
 */
export async function sendToHub(
  order: Order,
  source: string,
  landingId: string = HUB_LANDING_ID,
): Promise<HubResult> {
  if (!HUB_URL || !landingId) return "disabled";

  // Le hub raisonne par produit, pas par panier : une commande = une ligne.
  // Sur ce site une commande n'a qu'un article (la landing en vend un seul, et
  // le panier du tunnel est en pratique unitaire). Les lignes suivantes, s'il
  // y en avait, sont mentionnées dans la note pour ne rien perdre.
  const [first, ...rest] = order.lines;
  if (!first) return "failed";

  const productCode = HUB_PRODUCT_MAP[first.slug] ?? HUB_PRODUCT_MAP[first.productId];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${HUB_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      signal: controller.signal,
      body: JSON.stringify({
        landingPageId: landingId,
        productId: productCode,
        customer: {
          name: `${order.customer.firstName} ${order.customer.lastName}`.trim(),
          phone: order.customer.phone,
          wilaya: order.customer.wilaya,
          commune: order.customer.commune,
          address: order.customer.address,
        },
        quantity: first.quantity,
        variant: `${first.colorName} — pointure ${first.size}`,
        delivery: order.delivery,
        source,
        note: [
          `Référence boutique : ${order.reference}`,
          rest.length > 0
            ? `Autres articles : ${rest
                .map((line) => `${line.name} ${line.colorName} ${line.size} ×${line.quantity}`)
                .join(" / ")}`
            : "",
          order.customer.note ?? "",
        ]
          .filter(Boolean)
          .join(" · "),
      }),
    });

    const result = await response.json().catch(() => null);
    return result?.ok ? "saved" : "failed";
  } catch {
    return "failed";
  } finally {
    clearTimeout(timer);
  }
}
