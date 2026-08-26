"use client";

import { Ruler } from "lucide-react";
import type { SizeStock } from "@/lib/types";

/** Gamme complète du modèle : les pointures hors stock restent visibles,
 *  barrées, pour que le client voie ce qui existe et ce qui manque. */
export const SIZE_RANGE = ["39", "40", "41", "42", "43", "44", "45"];

interface SizeSelectorProps {
  sizes: SizeStock[];
  value: string | null;
  onChange: (size: string) => void;
  onOpenGuide: () => void;
  /** message d'erreur affiché si l'on tente d'ajouter sans choisir */
  error?: boolean;
}

export function SizeSelector({
  sizes,
  value,
  onChange,
  onOpenGuide,
  error = false,
}: SizeSelectorProps) {
  const stockOf = (size: string) => sizes.find((s) => s.size === size)?.stock ?? 0;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="eyebrow">
          Pointure
          {value && <span className="ml-2 normal-case text-fg">· {value}</span>}
        </p>

        <button
          type="button"
          onClick={onOpenGuide}
          className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold
            tracking-[0.08em] uppercase text-fg-2 transition-colors hover:text-accent-2"
        >
          <Ruler size={13} />
          Guide des tailles
        </button>
      </div>

      <div
        role="radiogroup"
        aria-label="Choisir une pointure"
        aria-invalid={error}
        className="flex flex-wrap gap-2"
      >
        {SIZE_RANGE.map((size) => {
          const stock = stockOf(size);
          const available = stock > 0;
          const selected = value === size;

          return (
            <button
              key={size}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={!available}
              onClick={() => onChange(size)}
              title={available ? `Pointure ${size} disponible` : `Pointure ${size} épuisée`}
              className={`relative h-12 min-w-12 rounded-md border px-3 text-sm font-semibold
                transition-all duration-300 ${
                  selected
                    ? "border-accent bg-accent-soft text-accent-2 shadow-[0_0_0_3px_rgba(22,119,255,0.12)]"
                    : available
                      ? "border-line-strong text-fg hover:border-accent-line hover:bg-white/4"
                      : "cursor-not-allowed border-line text-fg-3"
                }`}
            >
              {size}
              {!available && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-2 top-1/2 h-px
                    -rotate-[24deg] bg-fg-3/70"
                />
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="mt-2.5 text-xs text-[color:var(--color-danger)]">
          Choisissez une pointure avant d’ajouter au panier.
        </p>
      )}

      <p className="mt-3 text-xs text-fg-3">
        Les pointures barrées ne sont plus disponibles. Stock réel :{" "}
        {sizes.reduce((n, s) => n + s.stock, 0)} paire
        {sizes.reduce((n, s) => n + s.stock, 0) > 1 ? "s" : ""}.
      </p>
    </div>
  );
}
