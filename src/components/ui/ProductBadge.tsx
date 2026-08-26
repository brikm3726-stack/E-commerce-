import type { BadgeKind } from "@/lib/types";

const LABELS: Record<BadgeKind, { text: string; className: string }> = {
  nouveaute: { text: "Nouveauté", className: "badge-accent" },
  promo: { text: "Promo", className: "badge-danger" },
  bestseller: { text: "Best-seller", className: "" },
  "derniere-paire": { text: "Dernière paire", className: "badge-danger" },
};

export function ProductBadge({
  kind,
  className = "",
}: {
  kind: BadgeKind;
  className?: string;
}) {
  const badge = LABELS[kind];
  return <span className={`badge ${badge.className} ${className}`}>{badge.text}</span>;
}
