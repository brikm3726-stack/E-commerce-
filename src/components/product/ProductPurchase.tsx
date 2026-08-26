"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Minus, Plus, Zap } from "lucide-react";
import { SizeSelector } from "@/components/product/SizeSelector";
import { SizeGuide } from "@/components/product/SizeGuide";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { useStore } from "@/context/StoreProvider";
import { stockForSize, totalStock } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useStore();

  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  const stock = totalStock(product);
  const soldOut = stock === 0;
  const maxQuantity = size ? stockForSize(product, size) : 1;

  const pickSize = (next: string) => {
    setSize(next);
    setError(false);
    setQuantity(1);
  };

  const buildLine = (chosen: string) => ({
    productId: product.id,
    slug: product.slug,
    name: product.name,
    subtitle: product.subtitle,
    colorName: product.colorName,
    size: chosen,
    price: product.price,
    quantity,
    image: product.cutout.src,
    maxQuantity: stockForSize(product, chosen),
  });

  const handleBuyNow = () => {
    if (!size) {
      setError(true);
      return;
    }
    addToCart(buildLine(size));
    router.push("/commande");
  };

  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------------- coloris */}
      <div>
        <p className="eyebrow mb-3">
          Coloris
          <span className="ml-2 normal-case text-fg">· {product.colorName}</span>
        </p>

        <div className="flex flex-wrap gap-2.5">
          {product.colors.map((color) => {
            const current = color.slug === product.slug;
            return (
              <Link
                key={color.slug}
                href={`/produit/${color.slug}`}
                scroll={false}
                aria-label={`Coloris ${color.name}`}
                aria-current={current ? "true" : undefined}
                title={color.name}
                className={`grid size-12 place-items-center rounded-md border
                  transition-all duration-300 ${
                    current
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:border-line-strong hover:bg-white/4"
                  }`}
              >
                <span
                  className="size-6 rounded-full border border-white/20"
                  style={{
                    background: color.accentHex
                      ? `linear-gradient(135deg, ${color.hex} 55%, ${color.accentHex} 55%)`
                      : color.hex,
                  }}
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* -------------------------------------------------------- pointures */}
      <SizeSelector
        sizes={product.sizes}
        value={size}
        onChange={pickSize}
        onOpenGuide={() => setGuideOpen(true)}
        error={error}
      />

      {/* -------------------------------------------------------- quantité */}
      {size && maxQuantity > 1 && (
        <div className="anim-fade-in">
          <p className="eyebrow mb-3">Quantité</p>
          <div className="inline-flex items-center rounded-md border border-line">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Diminuer la quantité"
              className="grid size-11 place-items-center text-fg-2 transition-colors
                hover:text-fg disabled:opacity-30"
            >
              <Minus size={15} />
            </button>
            <span className="w-10 text-center font-semibold tabular-nums">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
              disabled={quantity >= maxQuantity}
              aria-label="Augmenter la quantité"
              className="grid size-11 place-items-center text-fg-2 transition-colors
                hover:text-fg disabled:opacity-30"
            >
              <Plus size={15} />
            </button>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------- actions */}
      <div className="space-y-2.5 pt-1">
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={soldOut}
            className="btn-cta flex-1"
          >
            <Zap size={17} className="shrink-0" />
            {soldOut ? "Épuisé" : "Acheter maintenant"}
          </button>

          <WishlistButton slug={product.slug} name={product.name} variant="inline" />
        </div>

        <p className="text-center text-[0.6875rem] text-fg-3">
          Paiement à la livraison — vous ne payez qu’à la réception
        </p>
      </div>

      {soldOut && (
        <p className="text-xs text-fg-2">
          Ce coloris est épuisé. Essayez un autre coloris ci-dessus ou{" "}
          <Link href="/contact" className="link-underline text-accent-2">
            prévenez-nous
          </Link>{" "}
          pour être averti du réassort.
        </p>
      )}

      {guideOpen && <SizeGuide onClose={() => setGuideOpen(false)} />}
    </div>
  );
}
