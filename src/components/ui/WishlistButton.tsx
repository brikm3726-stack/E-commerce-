"use client";

import { Heart } from "lucide-react";
import { useStore } from "@/context/StoreProvider";

interface WishlistButtonProps {
  slug: string;
  name: string;
  /** icon : pastille flottante sur une carte · inline : bouton dans la fiche */
  variant?: "icon" | "inline";
  className?: string;
}

export function WishlistButton({
  slug,
  name,
  variant = "icon",
  className = "",
}: WishlistButtonProps) {
  const { isWished, toggleWish, hydrated } = useStore();
  const active = hydrated && isWished(slug);

  const handleClick = (event: React.MouseEvent) => {
    // la carte entière est un lien : on empêche la navigation
    event.preventDefault();
    event.stopPropagation();
    toggleWish(slug, name);
  };

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={active}
        aria-label={active ? `Retirer ${name} des favoris` : `Ajouter ${name} aux favoris`}
        className={`btn btn-secondary w-12 shrink-0 px-0 ${
          active ? "border-accent-line text-accent-2" : ""
        } ${className}`}
      >
        <Heart size={18} className={active ? "fill-accent-2" : ""} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? `Retirer ${name} des favoris` : `Ajouter ${name} aux favoris`}
      className={`grid size-9 place-items-center rounded-md border border-line
        bg-ink/70 backdrop-blur-md transition-all duration-300
        hover:border-line-strong hover:bg-ink active:scale-95 ${
          active ? "border-accent-line text-accent-2" : "text-fg-2"
        } ${className}`}
    >
      <Heart
        size={15}
        className={`transition-transform duration-300 ${
          active ? "fill-accent-2 scale-110" : ""
        }`}
      />
    </button>
  );
}
