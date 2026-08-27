"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { lineKey, useStore } from "@/context/StoreProvider";
import { formatPrice } from "@/lib/format";
import { SHIPPING } from "@/data/site";

/** Squelette affiché le temps de relire le panier stocké. */
function CartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-4">
        {[0, 1].map((i) => (
          <div key={i} className="skeleton h-32 rounded-lg" />
        ))}
      </div>
      <div className="skeleton h-72 rounded-lg" />
    </div>
  );
}

export function CartContent() {
  const {
    cart,
    hydrated,
    subtotal,
    setQuantity,
    removeFromCart,
    clearCart,
    shippingFor,
  } = useStore();

  if (!hydrated) return <CartSkeleton />;

  if (cart.length === 0) {
    return (
      <div className="surface rounded-xl px-6 py-20 text-center">
        <div className="mx-auto mb-6 grid size-16 place-items-center rounded-full border border-line bg-black/[0.035]">
          <ShoppingBag size={24} className="text-fg-3" />
        </div>
        <h2 className="display mb-3 text-2xl">Votre panier est vide</h2>
        <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-fg-2">
          Chaque paire n’existe qu’en un seul exemplaire par pointure. Si un modèle vous
          plaît, ne tardez pas trop.
        </p>
        <Link href="/sneakers" className="btn btn-primary">
          Découvrir la collection
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  const shipping = shippingFor("domicile");
  const total = subtotal + shipping;
  const remaining = SHIPPING.freeFrom - subtotal;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
      {/* --------------------------------------------------------- lignes */}
      <div>
        <ul className="divide-y divide-line border-y border-line">
          {cart.map((line) => {
            const key = lineKey(line.productId, line.size);
            return (
              <li key={key} className="flex gap-4 py-5 sm:gap-5">
                <Link
                  href={`/produit/${line.slug}`}
                  className="surface-2 relative size-24 shrink-0 overflow-hidden rounded-md sm:size-28"
                >
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    sizes="112px"
                    className="object-contain p-1.5"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/produit/${line.slug}`}
                        className="font-display text-base font-bold uppercase transition-colors hover:text-accent-2"
                      >
                        {line.name}
                      </Link>
                      <p className="mt-0.5 truncate text-xs text-fg-2">{line.colorName}</p>
                      <p className="text-xs text-fg-3">Pointure {line.size}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(key)}
                      aria-label={`Retirer ${line.name} taille ${line.size}`}
                      className="shrink-0 rounded-md p-1.5 text-fg-3 transition-colors
                        hover:bg-black/[0.05] hover:text-[color:var(--color-danger)]"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                    <div className="flex items-center rounded-md border border-line">
                      <button
                        type="button"
                        onClick={() => setQuantity(key, line.quantity - 1)}
                        aria-label="Diminuer la quantité"
                        className="grid size-9 place-items-center text-fg-2 transition-colors hover:text-fg"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold tabular-nums">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(key, line.quantity + 1)}
                        disabled={line.quantity >= line.maxQuantity}
                        aria-label="Augmenter la quantité"
                        className="grid size-9 place-items-center text-fg-2 transition-colors
                          hover:text-fg disabled:opacity-30"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-display text-base font-bold">
                        {formatPrice(line.price * line.quantity)}
                      </p>
                      {line.quantity > 1 && (
                        <p className="text-xs text-fg-3">
                          {formatPrice(line.price)} l’unité
                        </p>
                      )}
                    </div>
                  </div>

                  {line.quantity >= line.maxQuantity && (
                    <p className="pt-2 text-[0.6875rem] text-fg-3">
                      Stock maximum atteint pour cette pointure.
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/sneakers"
            className="text-[0.8125rem] text-fg-2 transition-colors hover:text-fg"
          >
            ← Continuer mes achats
          </Link>
          <button
            type="button"
            onClick={clearCart}
            className="text-[0.8125rem] text-fg-3 transition-colors hover:text-[color:var(--color-danger)]"
          >
            Vider le panier
          </button>
        </div>
      </div>

      {/* --------------------------------------------------- récapitulatif */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="surface rounded-xl p-6">
          <h2 className="font-display text-base font-bold tracking-tight uppercase">
            Récapitulatif
          </h2>

          <dl className="mt-5 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-fg-2">Sous-total</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-fg-2">Livraison à domicile</dt>
              <dd className={shipping === 0 ? "text-[color:var(--color-success)]" : ""}>
                {shipping === 0 ? "Offerte" : formatPrice(shipping)}
              </dd>
            </div>
          </dl>

          {remaining > 0 && (
            <p className="mt-3 rounded-md border border-line bg-black/[0.035] px-3 py-2.5 text-xs text-fg-2">
              Ajoutez {formatPrice(remaining)} pour bénéficier de la livraison offerte.
            </p>
          )}

          <div className="rule my-5" />

          <div className="flex items-baseline justify-between">
            <span className="font-display text-sm font-bold uppercase">Total</span>
            <span className="font-display text-2xl font-bold">{formatPrice(total)}</span>
          </div>
          <p className="mt-1 text-xs text-fg-3">Frais de livraison ajustés au checkout.</p>

          <Link href="/commande" className="btn btn-primary mt-6 w-full">
            Passer la commande
            <ArrowRight size={15} />
          </Link>

          <ul className="mt-5 space-y-2 text-xs text-fg-3">
            <li>· Paiement à la livraison, en espèces</li>
            <li>· Livraison dans les 58 wilayas</li>
            <li>· Échange sous 48 h si la pointure ne va pas</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
