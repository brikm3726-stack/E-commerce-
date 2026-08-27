import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { ProductBadge } from "@/components/ui/ProductBadge";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { totalStock } from "@/lib/catalog";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  /** priorité de chargement pour les premières cartes visibles */
  priority?: boolean;
  /** indice dans la grille, sert au décalage d'apparition */
  index?: number;
}

export function ProductCard({ product, priority = false, index = 0 }: ProductCardProps) {
  const stock = totalStock(product);
  const soldOut = stock === 0;
  const lastPairs = stock > 0 && stock <= 2;

  return (
    <article
      className="group relative"
      style={{ animationDelay: `${Math.min(index, 7) * 60}ms` }}
    >
      <Link
        href={`/produit/${product.slug}`}
        className="block focus-visible:outline-none"
        aria-label={`${product.name} ${product.colorName}`}
      >
        {/* ---------------------------------------------------------- visuel */}
        {/* Les photos du catalogue sont de vraies photos portées, aux fonds
            variés : elles remplissent la carte (`object-cover`) plutôt que de
            flotter sur une tuile. */}
        <div
          className="relative aspect-4/5 overflow-hidden rounded-lg border border-line
            bg-card-2 transition-all duration-500 group-hover:border-accent-line
            group-hover:shadow-[0_22px_60px_-24px_rgba(245,179,1,0.5)]"
        >
          <Image
            src={product.cutout.src}
            alt={product.cutout.alt}
            fill
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 22vw"
            priority={priority}
            className={`object-cover transition-transform duration-[900ms]
              ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]
              ${soldOut ? "opacity-45 grayscale" : ""}`}
          />

          {/* voile bas : garde les badges et le bouton lisibles sur la photo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3
              bg-gradient-to-t from-black/35 to-transparent opacity-0
              transition-opacity duration-500 group-hover:opacity-100"
          />

          {/* badges */}
          <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            <div className="flex flex-col items-start gap-1.5">
              {product.badge && (
                <ProductBadge kind={product.badge} className="badge-on-photo" />
              )}
              {lastPairs && !soldOut && (
                <span className="badge badge-danger badge-on-photo">
                  {stock === 1 ? "Dernière paire" : `Plus que ${stock}`}
                </span>
              )}
              {soldOut && <span className="badge badge-on-photo">Épuisé</span>}
            </div>

            <div className="pointer-events-auto">
              <WishlistButton slug={product.slug} name={product.name} />
            </div>
          </div>

          {/* --------------------------------------- appel à l'achat, au survol */}
          {!soldOut && (
            <div
              className="absolute inset-x-2.5 bottom-2.5 translate-y-3 opacity-0
                transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover:translate-y-0 group-hover:opacity-100"
            >
              <span
                className="btn-cta flex h-10 w-full items-center justify-center gap-2
                  rounded-md text-[0.6875rem]"
              >
                <Zap size={14} />
                Acheter maintenant
              </span>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------ description */}
        <div className="mt-3.5 space-y-1.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-sm font-bold tracking-tight uppercase text-fg">
                {product.name}
              </h3>
              {/* le coloris seul : le sous-titre complet se tronquait sur mobile */}
              <p className="truncate text-xs text-fg-2">{product.colorName}</p>
            </div>
            <Rating value={product.rating} size="sm" compact className="mt-0.5 shrink-0" />
          </div>

          <Price value={product.price} oldValue={product.oldPrice} size="sm" />

          {/* coloris disponibles du modèle */}
          {product.colors.length > 1 && (
            <div className="flex items-center gap-1.5 pt-0.5">
              {product.colors.map((color) => (
                <span
                  key={color.slug}
                  title={color.name}
                  className={`size-3.5 rounded-full border transition-transform duration-200 ${
                    color.slug === product.slug
                      ? "border-accent-2 scale-110"
                      : "border-line-strong"
                  }`}
                  style={{
                    background: color.accentHex
                      ? `linear-gradient(135deg, ${color.hex} 55%, ${color.accentHex} 55%)`
                      : color.hex,
                  }}
                />
              ))}
              <span className="ml-0.5 text-[0.625rem] text-fg-3">
                {product.colors.length} coloris
              </span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
