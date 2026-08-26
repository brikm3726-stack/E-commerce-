"use client";

import Link from "next/link";
import { ArrowRight, Heart, Package, Phone, ShoppingBag } from "lucide-react";
import { useStore } from "@/context/StoreProvider";
import { formatDate, formatPrice } from "@/lib/format";
import { SITE } from "@/data/site";

/**
 * Espace client sans compte : tout est lu depuis l'appareil (dernière commande,
 * favoris, panier). L'architecture est prête pour une vraie authentification —
 * il suffira de remplacer cette source par les données du profil connecté.
 */
export function AccountContent() {
  const { lastOrder, wishlist, cart, hydrated } = useStore();

  if (!hydrated) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  const cartCount = cart.reduce((n, l) => n + l.quantity, 0);

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------------- vue rapide */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: ShoppingBag,
            label: "Panier en cours",
            value: cartCount === 0 ? "Vide" : `${cartCount} article${cartCount > 1 ? "s" : ""}`,
            href: "/panier",
            action: "Voir le panier",
          },
          {
            icon: Heart,
            label: "Favoris",
            value:
              wishlist.length === 0
                ? "Aucun"
                : `${wishlist.length} article${wishlist.length > 1 ? "s" : ""}`,
            href: "/favoris",
            action: "Voir mes favoris",
          },
          {
            icon: Package,
            label: "Dernière commande",
            value: lastOrder ? lastOrder.reference : "Aucune",
            href: lastOrder ? "/commande/confirmation" : "/sneakers",
            action: lastOrder ? "Voir le détail" : "Commencer mes achats",
          },
        ].map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="surface group rounded-xl p-5 transition-all duration-400 hover:border-line-strong"
          >
            <card.icon size={18} className="mb-4 text-accent-2" />
            <p className="eyebrow mb-1.5">{card.label}</p>
            <p className="font-display text-lg font-bold">{card.value}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.1em] uppercase text-fg-2 transition-colors group-hover:text-accent-2">
              {card.action}
              <ArrowRight
                size={12}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </Link>
        ))}
      </div>

      {/* ---------------------------------------------------- suivi commande */}
      <section className="surface rounded-xl p-6 md:p-7">
        <h2 className="font-display text-base font-bold uppercase">Suivi de commande</h2>

        {lastOrder ? (
          <div className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-lg font-bold tracking-wider">
                  {lastOrder.reference}
                </p>
                <p className="text-xs text-fg-3">
                  Passée le {formatDate(lastOrder.createdAt.slice(0, 10))}
                </p>
              </div>
              <span className="badge badge-accent">En cours de traitement</span>
            </div>

            <ol className="mt-6 space-y-4">
              {[
                { label: "Commande enregistrée", done: true },
                { label: "Appel de confirmation", done: false },
                { label: "Colis expédié", done: false },
                { label: "Livré", done: false },
              ].map((step, index, all) => (
                <li key={step.label} className="flex gap-3.5">
                  <div className="flex flex-col items-center">
                    <span
                      className={`grid size-5 shrink-0 place-items-center rounded-full border
                        ${step.done ? "border-accent bg-accent" : "border-line-strong"}`}
                    >
                      {step.done && <span className="size-1.5 rounded-full bg-white" />}
                    </span>
                    {index < all.length - 1 && (
                      <span className="mt-1 h-6 w-px bg-line" aria-hidden="true" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${step.done ? "text-fg" : "text-fg-3"}`}
                  >
                    {step.label}
                  </span>
                </li>
              ))}
            </ol>

            <div className="rule my-6" />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm text-fg-2">Montant à régler à la livraison</span>
              <span className="font-display text-xl font-bold">
                {formatPrice(lastOrder.total)}
              </span>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-fg-2">
            Aucune commande enregistrée sur cet appareil. Vos commandes apparaissent ici
            juste après leur validation.
          </p>
        )}
      </section>

      {/* ------------------------------------------------------------ aide */}
      <section className="surface rounded-xl p-6 md:p-7">
        <h2 className="font-display text-base font-bold uppercase">Besoin d’aide&nbsp;?</h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-fg-2">
          Pour toute question sur une commande, un échange ou une pointure, appelez-nous
          directement — c’est le plus rapide.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="btn btn-primary">
            <Phone size={15} />
            {SITE.phone}
          </a>
          <Link href="/aide/faq" className="btn btn-secondary">
            Questions fréquentes
          </Link>
        </div>
      </section>
    </div>
  );
}
