import { SHOPIFY_ORDER_ENDPOINT } from "@/data/site";
import type { Order } from "@/lib/types";

/**
 * Création de la commande dans Shopify, via le Worker Cloudflare (`worker/`).
 *
 * Même philosophie que `notifyOrder` : le site est statique, c'est le
 * navigateur du client qui poste. On n'attend JAMAIS le réseau devant
 * l'utilisateur — l'appelant affiche la confirmation tout de suite et laisse
 * cette promesse se terminer en arrière-plan (`keepalive`).
 *
 * Tant que `SHOPIFY_ORDER_ENDPOINT` est vide, la fonction ne fait rien et
 * renvoie `"disabled"` : le comportement du site est identique à avant.
 */

export type ShopifyOrderResult = "sent" | "disabled" | "failed";

const TIMEOUT_MS = 12_000;

interface Payload {
  reference: string;
  source: string;
  currency: "DZD";
  delivery: "domicile" | "bureau";
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    wilaya: string;
    commune: string;
    address: string;
  };
  lines: { name: string; variant: string; size: string; price: number; quantity: number }[];
  subtotal: number;
  shipping: number;
  total: number;
}

function toPayload(order: Order, source: string): Payload {
  return {
    reference: order.reference,
    source,
    currency: "DZD",
    delivery: order.delivery,
    customer: {
      firstName: order.customer.firstName,
      lastName: order.customer.lastName,
      phone: order.customer.phone,
      wilaya: order.customer.wilaya,
      commune: order.customer.commune,
      address: order.customer.address,
    },
    lines: order.lines.map((l) => ({
      name: l.name,
      variant: l.colorName,
      size: l.size,
      price: l.price,
      quantity: l.quantity,
    })),
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
  };
}

export async function createShopifyOrder(
  order: Order,
  source: string,
): Promise<ShopifyOrderResult> {
  if (!SHOPIFY_ORDER_ENDPOINT) return "disabled";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(SHOPIFY_ORDER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(order, source)),
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
