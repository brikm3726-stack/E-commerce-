import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  /** nombre de colonnes sur grand écran (2 sur mobile, 3 sur tablette) */
  columns?: 3 | 4;
  /** les N premières cartes sont chargées en priorité */
  priorityCount?: number;
  className?: string;
}

export function ProductGrid({
  products,
  columns = 4,
  priorityCount = 2,
  className = "",
}: ProductGridProps) {
  // `columns` est un plafond : avec trois produits on reste sur trois colonnes
  // plutôt que de laisser une case vide en bout de rangée.
  const effective = Math.min(columns, Math.max(products.length, 2));
  const large = effective >= 4 ? "xl:grid-cols-4" : "xl:grid-cols-3";

  return (
    <div
      className={`grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-5 md:grid-cols-3 ${large} ${className}`}
    >
      {products.map((product, index) => (
        <Reveal key={product.id} delay={Math.min(index, 7) * 70}>
          <ProductCard product={product} index={index} priority={index < priorityCount} />
        </Reveal>
      ))}
    </div>
  );
}
