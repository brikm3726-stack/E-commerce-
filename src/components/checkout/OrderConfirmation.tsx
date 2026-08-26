"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Copy, Phone, Truck } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/context/StoreProvider";
import { formatPrice } from "@/lib/format";
import { orderAsMessage } from "@/lib/orders";
import { SITE } from "@/data/site";

export function OrderConfirmation() {
  const { lastOrder, hydrated } = useStore();
  const [copied, setCopied] = useState(false);

  if (!hydrated) {
    return <div className="skeleton mx-auto h-96 max-w-2xl rounded-xl" />;
  }

  if (!lastOrder) {
    return (
      <div className="surface mx-auto max-w-lg rounded-xl px-6 py-16 text-center">
        <h2 className="display mb-3 text-2xl">Aucune commande récente</h2>
        <p className="mb-8 text-sm text-fg-2">
          Vous n’avez pas de commande enregistrée sur cet appareil.
        </p>
        <Link href="/sneakers" className="btn btn-primary">
          Voir la collection
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  const order = lastOrder;

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(order.reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* presse-papiers indisponible : la référence reste lisible à l'écran */
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* ------------------------------------------------------- en-tête */}
      <div className="surface relative overflow-hidden rounded-xl px-6 py-10 text-center md:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(500px 220px at 50% 0%, rgba(34,197,94,0.14), transparent 70%)",
          }}
        />

        <div className="relative">
          <div className="anim-scale-in mx-auto mb-6 grid size-16 place-items-center rounded-full border border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.1)]">
            <Check size={28} className="text-[color:var(--color-success)]" />
          </div>

          <h1 className="display text-[clamp(1.8rem,5vw,2.6rem)]">Commande enregistrée</h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-fg-2">
            Merci {order.customer.firstName}. Nous vous appelons au{" "}
            <span className="text-fg">{order.customer.phone}</span> dans les prochaines
            heures pour confirmer la disponibilité et la livraison.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-md border border-line bg-white/3 px-4 py-2.5">
            <span className="text-xs text-fg-3">Référence</span>
            <span className="font-display text-sm font-bold tracking-wider">
              {order.reference}
            </span>
            <button
              type="button"
              onClick={copyReference}
              aria-label="Copier la référence de commande"
              className="text-fg-3 transition-colors hover:text-accent-2"
            >
              {copied ? (
                <Check size={14} className="text-[color:var(--color-success)]" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------- détail */}
      <div className="surface mt-4 rounded-xl p-6 md:p-7">
        <h2 className="font-display text-base font-bold uppercase">Récapitulatif</h2>

        <ul className="mt-5 divide-y divide-line">
          {order.lines.map((line) => (
            <li key={`${line.productId}:${line.size}`} className="flex gap-3.5 py-3.5">
              <div className="surface-2 relative size-16 shrink-0 overflow-hidden rounded-md">
                <Image
                  src={line.image}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[0.875rem] font-semibold">{line.name}</p>
                <p className="text-xs text-fg-2">{line.colorName}</p>
                <p className="text-xs text-fg-3">
                  Pointure {line.size} · quantité {line.quantity}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold">
                {formatPrice(line.price * line.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="rule my-5" />

        <dl className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-fg-2">Sous-total</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-fg-2">
              Livraison {order.delivery === "domicile" ? "à domicile" : "au bureau"}
            </dt>
            <dd className={order.shipping === 0 ? "text-[color:var(--color-success)]" : ""}>
              {order.shipping === 0 ? "Offerte" : formatPrice(order.shipping)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between pt-2">
            <dt className="font-display text-sm font-bold uppercase">À payer à la réception</dt>
            <dd className="font-display text-xl font-bold">{formatPrice(order.total)}</dd>
          </div>
        </dl>

        <div className="rule my-5" />

        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="eyebrow mb-1.5">Livré à</p>
            <p className="text-fg">
              {order.customer.firstName} {order.customer.lastName}
            </p>
            <p className="text-fg-2">{order.customer.phone}</p>
            {order.customer.address && (
              <p className="text-fg-2">{order.customer.address}</p>
            )}
            <p className="text-fg-2">
              {order.customer.commune}, {order.customer.wilaya}
            </p>
          </div>

          <div>
            <p className="eyebrow mb-1.5">Prochaine étape</p>
            <p className="flex items-start gap-2 text-fg-2">
              <Phone size={14} className="mt-0.5 shrink-0 text-accent-2" />
              Appel de confirmation
            </p>
            <p className="mt-1.5 flex items-start gap-2 text-fg-2">
              <Truck size={14} className="mt-0.5 shrink-0 text-accent-2" />
              Expédition sous 24 h ouvrées
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------ actions */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a
          href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(orderAsMessage(order))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary flex-1"
        >
          Confirmer sur WhatsApp
          <ArrowRight size={15} />
        </a>
        <Link href="/sneakers" className="btn btn-secondary flex-1">
          Continuer mes achats
        </Link>
      </div>

      <p className="mt-5 text-center text-xs text-fg-3">
        Conservez la référence {order.reference} pour toute question sur votre commande.
      </p>
    </div>
  );
}
