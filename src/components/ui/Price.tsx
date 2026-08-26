import { discountPercent, formatPrice } from "@/lib/format";

interface PriceProps {
  value: number;
  oldValue?: number;
  /** sm : cartes · md : listes · lg : fiche produit */
  size?: "sm" | "md" | "lg";
  className?: string;
  /** masque la pastille de remise (utile dans le panier) */
  hideDiscount?: boolean;
}

const SIZES = {
  sm: { now: "text-[0.9375rem]", was: "text-xs" },
  md: { now: "text-lg", was: "text-sm" },
  lg: { now: "text-3xl md:text-4xl", was: "text-base" },
};

export function Price({
  value,
  oldValue,
  size = "sm",
  className = "",
  hideDiscount = false,
}: PriceProps) {
  const discount = discountPercent(value, oldValue);
  const s = SIZES[size];

  return (
    <div className={`flex flex-wrap items-baseline gap-x-2.5 gap-y-1 ${className}`}>
      <span className={`font-display font-bold tracking-tight text-fg ${s.now}`}>
        {formatPrice(value)}
      </span>

      {oldValue && oldValue > value && (
        <span className={`text-fg-3 line-through ${s.was}`}>{formatPrice(oldValue)}</span>
      )}

      {discount !== null && !hideDiscount && (
        <span className="badge badge-danger h-5 px-1.5 text-[0.5625rem]">
          −{discount}%
        </span>
      )}
    </div>
  );
}
