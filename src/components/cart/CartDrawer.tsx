"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { lineKey, useStore } from "@/context/StoreProvider";
import { formatPrice } from "@/lib/format";
import { SHIPPING } from "@/data/site";

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    subtotal,
    setQuantity,
    removeFromCart,
    shippingFor,
  } = useStore();
  const pathname = usePathname();

  useEffect(() => {
    setCartOpen(false);
  }, [pathname, setCartOpen]);

  if (!cartOpen) return null;

  const shipping = shippingFor("domicile");
  const remaining = SHIPPING.freeFrom - subtotal;
  const progress = Math.min((subtotal / SHIPPING.freeFrom) * 100, 100);

  return (
    <div className="fixed inset-0 z-[75]">
      <button
        type="button"
        aria-label="Fermer le panier"
        onClick={() => setCartOpen(false)}
        className="anim-fade-in absolute inset-0 bg-ink/80 backdrop-blur-sm"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
        className="anim-slide-left glass-panel absolute inset-y-0 right-0 flex w-full
          max-w-md flex-col border-l border-line"
      >
        {/* ------------------------------------------------------- entête */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
          <h2 className="font-display text-base font-bold tracking-tight uppercase">
            Panier
            {cart.length > 0 && (
              <span className="ml-2 text-fg-3">
                ({cart.reduce((n, l) => n + l.quantity, 0)})
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Fermer le panier"
            className="-mr-2 grid size-10 place-items-center rounded-md text-fg-2
              transition-colors hover:bg-black/[0.05] hover:text-fg"
          >
            <X size={20} />
          </button>
        </header>

        {cart.length === 0 ? (
          /* ---------------------------------------------------- vide */
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="mb-5 grid size-16 place-items-center rounded-full border border-line bg-black/[0.035]">
              <ShoppingBag size={24} className="text-fg-3" />
            </div>
            <p className="mb-2 font-display text-lg font-bold uppercase">
              Votre panier est vide
            </p>
            <p className="mb-7 max-w-xs text-sm text-fg-2">
              Chaque paire est disponible en un seul exemplaire par pointure.
            </p>
            <Link href="/sneakers" className="btn btn-primary">
              Découvrir la collection
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <>
            {/* ------------------------------------ palier livraison offerte */}
            <div className="shrink-0 border-b border-line px-5 py-3.5">
              {remaining > 0 ? (
                <p className="mb-2 text-xs text-fg-2">
                  Plus que{" "}
                  <span className="font-semibold text-fg">{formatPrice(remaining)}</span>{" "}
                  pour la livraison offerte
                </p>
              ) : (
                <p className="mb-2 text-xs font-semibold text-[color:var(--color-success)]">
                  Livraison offerte débloquée
                </p>
              )}
              <div className="h-1 overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2
                    transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* ------------------------------------------------------ lignes */}
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {cart.map((line) => {
                const key = lineKey(line.productId, line.size);
                return (
                  <li key={key} className="anim-fade-in flex gap-3.5 py-4">
                    <Link
                      href={`/produit/${line.slug}`}
                      className="surface-2 relative size-20 shrink-0 overflow-hidden rounded-md"
                    >
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        sizes="80px"
                        className="object-contain p-1"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={`/produit/${line.slug}`}
                            className="font-display text-sm font-bold uppercase hover:text-accent-2"
                          >
                            {line.name}
                          </Link>
                          <p className="truncate text-xs text-fg-2">{line.colorName}</p>
                          <p className="text-xs text-fg-3">Pointure {line.size}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(key)}
                          aria-label={`Retirer ${line.name} taille ${line.size} du panier`}
                          className="shrink-0 p-1 text-fg-3 transition-colors hover:text-[color:var(--color-danger)]"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                        <div className="flex items-center rounded-md border border-line">
                          <button
                            type="button"
                            onClick={() => setQuantity(key, line.quantity - 1)}
                            aria-label="Diminuer la quantité"
                            className="grid size-8 place-items-center text-fg-2
                              transition-colors hover:text-fg"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold tabular-nums">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(key, line.quantity + 1)}
                            disabled={line.quantity >= line.maxQuantity}
                            aria-label="Augmenter la quantité"
                            className="grid size-8 place-items-center text-fg-2
                              transition-colors hover:text-fg disabled:opacity-30"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatPrice(line.price * line.quantity)}
                        </span>
                      </div>

                      {line.quantity >= line.maxQuantity && (
                        <p className="pt-1.5 text-[0.6875rem] text-fg-3">
                          Stock maximum pour cette pointure
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* -------------------------------------------------- récapitulatif */}
            <footer className="shrink-0 space-y-3 border-t border-line px-5 py-5">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-fg-2">
                  <span>Sous-total</span>
                  <span className="text-fg">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-fg-2">
                  <span>Livraison à domicile</span>
                  <span className={shipping === 0 ? "text-[color:var(--color-success)]" : "text-fg"}>
                    {shipping === 0 ? "Offerte" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="rule my-2.5" />
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-sm font-bold uppercase">Total</span>
                  <span className="font-display text-xl font-bold">
                    {formatPrice(subtotal + shipping)}
                  </span>
                </div>
              </div>

              <Link href="/commande" className="btn btn-primary w-full">
                Passer la commande
                <ArrowRight size={15} />
              </Link>
              <Link href="/panier" className="btn btn-ghost h-10 w-full text-[0.6875rem]">
                Voir le panier en détail
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
