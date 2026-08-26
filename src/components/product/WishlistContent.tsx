"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useStore } from "@/context/StoreProvider";
import { getAllProducts } from "@/lib/catalog";

export function WishlistContent() {
  const { wishlist, hydrated } = useStore();

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="skeleton aspect-4/5 rounded-lg" />
            <div className="skeleton h-4 w-2/3 rounded-xs" />
            <div className="skeleton h-4 w-1/3 rounded-xs" />
          </div>
        ))}
      </div>
    );
  }

  const products = getAllProducts().filter((product) => wishlist.includes(product.slug));

  if (products.length === 0) {
    return (
      <div className="surface rounded-xl px-6 py-20 text-center">
        <div className="mx-auto mb-6 grid size-16 place-items-center rounded-full border border-line bg-white/3">
          <Heart size={24} className="text-fg-3" />
        </div>
        <h2 className="display mb-3 text-2xl">Aucun favori pour l’instant</h2>
        <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-fg-2">
          Touchez le cœur sur une paire pour la retrouver ici, même après avoir fermé le
          site.
        </p>
        <Link href="/sneakers" className="btn btn-primary">
          Parcourir la collection
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-6 text-xs text-fg-3">
        {products.length} article{products.length > 1 ? "s" : ""} sauvegardé
        {products.length > 1 ? "s" : ""} sur cet appareil
      </p>
      <ProductGrid products={products} priorityCount={2} />
    </div>
  );
}
