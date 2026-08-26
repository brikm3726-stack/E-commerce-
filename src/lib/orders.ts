import { orderReference } from "@/lib/format";
import type {
  CartLine,
  DeliveryMode,
  Order,
  OrderCustomer,
  PaymentMethod,
} from "@/lib/types";

/**
 * Service de commande.
 *
 * Aujourd'hui la commande est confirmée côté client et conservée localement :
 * la boutique fonctionne sans backend, l'appel du client se fait par téléphone.
 * Le jour où un backend existe, seule `submitOrder` change — elle devient un
 * POST (Supabase, API, e-mail) et garde exactement la même signature.
 */

export interface PaymentOption {
  id: PaymentMethod;
  label: string;
  description: string;
  available: boolean;
}

export const PAYMENT_METHODS: PaymentOption[] = [
  {
    id: "cod",
    label: "Paiement à la livraison",
    description: "Vous réglez en espèces au moment de la réception du colis.",
    available: true,
  },
  {
    id: "cib",
    label: "Carte CIB",
    description: "Paiement en ligne par carte bancaire CIB — bientôt disponible.",
    available: false,
  },
  {
    id: "edahabia",
    label: "Edahabia",
    description: "Paiement par carte Edahabia (Algérie Poste) — bientôt disponible.",
    available: false,
  },
];

export interface SubmitOrderInput {
  customer: OrderCustomer;
  delivery: DeliveryMode;
  payment: PaymentMethod;
  lines: CartLine[];
  subtotal: number;
  shipping: number;
}

export async function submitOrder(input: SubmitOrderInput): Promise<Order> {
  const order: Order = {
    reference: orderReference(),
    createdAt: new Date().toISOString(),
    customer: input.customer,
    delivery: input.delivery,
    payment: input.payment,
    lines: input.lines,
    subtotal: input.subtotal,
    shipping: input.shipping,
    total: input.subtotal + input.shipping,
  };

  // laisse le temps au bouton d'afficher son état de chargement
  await new Promise((resolve) => setTimeout(resolve, 650));

  return order;
}

/** Récapitulatif prêt à coller dans WhatsApp, pour confirmer la commande. */
export function orderAsMessage(order: Order): string {
  const lines = order.lines
    .map(
      (line) =>
        `- ${line.name} ${line.colorName} · pointure ${line.size} × ${line.quantity}`,
    )
    .join("\n");

  return [
    `Commande ${order.reference}`,
    `${order.customer.firstName} ${order.customer.lastName} — ${order.customer.phone}`,
    `${order.customer.address}, ${order.customer.commune}, ${order.customer.wilaya}`,
    order.delivery === "domicile" ? "Livraison à domicile" : "Retrait au bureau",
    "",
    lines,
    "",
    `Total : ${order.total} DA`,
  ].join("\n");
}
