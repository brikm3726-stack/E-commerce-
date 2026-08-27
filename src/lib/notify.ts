import { WEB3FORMS_KEY } from "@/data/site";
import type { Order } from "@/lib/types";

/**
 * Envoi de la commande par e-mail, via Web3Forms.
 *
 * Le site est statique : il n'y a pas de serveur pour envoyer un e-mail. C'est
 * donc le navigateur du client qui poste directement la commande à Web3Forms,
 * qui la relaie vers la boîte mail rattachée à la clé.
 *
 * Deux règles tirées d'une campagne précédente :
 *
 * 1. `keepalive` — la requête doit survivre si la page change ou se ferme
 *    juste après la validation, sinon la commande est perdue en route.
 * 2. Ne JAMAIS faire attendre le client. L'appelant affiche la confirmation
 *    tout de suite et laisse cette fonction se terminer en arrière-plan. Sur un
 *    tunnel Facebook Ads, faire patienter quelqu'un devant un écran figé, c'est
 *    la commande perdue.
 *
 * FormSubmit n'est pas une option : le service est injoignable depuis une
 * connexion algérienne.
 */

const ENDPOINT = "https://api.web3forms.com/submit";

/** Au-delà, on abandonne : le secours WhatsApp prend le relais. */
const TIMEOUT_MS = 12_000;

export type NotifyResult =
  /** parti chez Web3Forms */
  | "sent"
  /** clé absente : l'envoi n'est tout simplement pas configuré */
  | "disabled"
  /** réseau coupé, délai dépassé, ou refus du service */
  | "failed";

/** Ce que l'e-mail affichera, dans cet ordre. */
function fields(order: Order, source: string) {
  const article = order.lines
    .map((l) => `${l.name} ${l.colorName} — pointure ${l.size} × ${l.quantity}`)
    .join(" / ");

  return {
    access_key: WEB3FORMS_KEY,
    subject: `Commande ${order.reference} — ${order.total} DA`,
    from_name: "EcomDZ",

    Référence: order.reference,
    Client: `${order.customer.firstName} ${order.customer.lastName}`.trim(),
    Téléphone: order.customer.phone,
    Wilaya: order.customer.wilaya,
    Commune: order.customer.commune,
    Adresse: order.customer.address,
    Livraison:
      order.delivery === "domicile"
        ? "À domicile"
        : "Retrait au bureau du transporteur",

    Article: article,
    "Sous-total": `${order.subtotal} DA`,
    "Frais de livraison": `${order.shipping} DA`,
    Total: `${order.total} DA`,
    Paiement: "À la livraison",

    Origine: source,
    Reçue: new Date(order.createdAt).toLocaleString("fr-DZ"),
  };
}

/**
 * @param source d'où vient la commande — « Page pub arabe » ou « Site », pour
 *   savoir ce que rapporte la campagne sans ouvrir d'outil d'analyse.
 */
export async function notifyOrder(order: Order, source: string): Promise<NotifyResult> {
  if (!WEB3FORMS_KEY) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[EcomDZ] Aucune commande envoyée : WEB3FORMS_KEY est vide dans src/data/site.ts",
      );
    }
    return "disabled";
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(fields(order, source)),
      keepalive: true,
      signal: controller.signal,
    });
    return response.ok ? "sent" : "failed";
  } catch {
    return "failed";
  } finally {
    clearTimeout(timer);
  }
}
