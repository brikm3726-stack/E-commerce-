import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  reviews?: number;
  size?: "sm" | "md";
  className?: string;
  /** cache le nombre d'avis (cartes compactes) */
  compact?: boolean;
}

export function Rating({
  value,
  reviews,
  size = "sm",
  className = "",
  compact = false,
}: RatingProps) {
  const px = size === "sm" ? 12 : 15;
  const rounded = Math.round(value);

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      aria-label={`Note ${value} sur 5${reviews ? `, ${reviews} avis` : ""}`}
    >
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={px}
            strokeWidth={0}
            className={i < rounded ? "fill-accent-2" : "fill-black/15"}
          />
        ))}
      </div>

      {!compact && (
        <span className={`text-fg-3 ${size === "sm" ? "text-xs" : "text-sm"}`}>
          {value.toFixed(1)}
          {reviews !== undefined && (
            <span className="text-fg-3"> · {reviews} avis</span>
          )}
        </span>
      )}
    </div>
  );
}
