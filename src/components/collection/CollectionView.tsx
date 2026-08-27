"use client";

import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Reveal } from "@/components/ui/Reveal";
import { allColors, allSizes, priceRange, totalStock } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

type SortKey = "pertinence" | "nouveautes" | "prix-croissant" | "prix-decroissant" | "ventes";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "pertinence", label: "Pertinence" },
  { key: "nouveautes", label: "Nouveautés" },
  { key: "prix-croissant", label: "Prix croissant" },
  { key: "prix-decroissant", label: "Prix décroissant" },
  { key: "ventes", label: "Meilleures ventes" },
];

interface CollectionViewProps {
  products: Product[];
  /** colonnes sur grand écran */
  columns?: 3 | 4;
}

export function CollectionView({ products, columns = 4 }: CollectionViewProps) {
  const [sort, setSort] = useState<SortKey>("pertinence");
  const [open, setOpen] = useState(false);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const [minPrice, maxPrice] = useMemo(() => priceRange(products), [products]);
  const [priceCap, setPriceCap] = useState<number | null>(null);

  const sizeOptions = useMemo(() => allSizes(products), [products]);
  const colorOptions = useMemo(() => allColors(products), [products]);
  const typeOptions = useMemo(
    () => [...new Set(products.map((p) => p.type))],
    [products],
  );

  const toggle = (
    value: string,
    list: string[],
    setList: (next: string[]) => void,
  ) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const activeCount =
    sizes.length +
    colors.length +
    types.length +
    (inStockOnly ? 1 : 0) +
    (priceCap !== null ? 1 : 0);

  const reset = () => {
    setSizes([]);
    setColors([]);
    setTypes([]);
    setInStockOnly(false);
    setPriceCap(null);
  };

  const visible = useMemo(() => {
    let list = products.filter((product) => {
      if (priceCap !== null && product.price > priceCap) return false;
      if (inStockOnly && totalStock(product) === 0) return false;
      if (types.length && !types.includes(product.type)) return false;
      if (colors.length && !colors.includes(product.colorName)) return false;
      if (sizes.length) {
        const has = product.sizes.some((s) => sizes.includes(s.size) && s.stock > 0);
        if (!has) return false;
      }
      return true;
    });

    switch (sort) {
      case "nouveautes":
        list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case "prix-croissant":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "prix-decroissant":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "ventes":
        list = [...list].sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        // pertinence : en stock d'abord, puis les mieux notés
        list = [...list].sort((a, b) => {
          const stockDelta = Number(totalStock(b) > 0) - Number(totalStock(a) > 0);
          return stockDelta !== 0 ? stockDelta : b.rating - a.rating;
        });
    }

    return list;
  }, [products, priceCap, inStockOnly, types, colors, sizes, sort]);

  /* ------------------------------------------------------------- rendu --- */

  const chip = (active: boolean) =>
    `rounded-md border px-3 py-2 text-[0.8125rem] transition-all duration-250 ${
      active
        ? "border-accent bg-accent-soft text-accent-2"
        : "border-line text-fg-2 hover:border-line-strong hover:text-fg"
    }`;

  return (
    <div>
      {/* ------------------------------------------------------ barre outils */}
      <div className="sticky top-16 z-30 -mx-5 mb-6 border-y border-line bg-ink/85 px-5 py-3 backdrop-blur-xl md:top-18 md:-mx-8 md:px-8">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className={`inline-flex h-10 items-center gap-2 rounded-md border px-3.5
              text-[0.8125rem] font-medium transition-all duration-300 ${
                open || activeCount > 0
                  ? "border-accent-line bg-accent-soft text-accent-2"
                  : "border-line text-fg-2 hover:border-line-strong hover:text-fg"
              }`}
          >
            <SlidersHorizontal size={15} />
            Filtres
            {activeCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-accent text-[0.625rem] font-bold text-[#1b1710]">
                {activeCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-fg-3 sm:inline">
              {visible.length} produit{visible.length > 1 ? "s" : ""}
            </span>

            <div className="relative">
              <label htmlFor="tri" className="sr-only">
                Trier par
              </label>
              <select
                id="tri"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="h-10 appearance-none rounded-md border border-line bg-transparent
                  pr-9 pl-3.5 text-[0.8125rem] text-fg-2 transition-colors
                  hover:border-line-strong hover:text-fg focus:outline-none"
              >
                {SORTS.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-fg-3"
              />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------- panneau */}
        <div
          className="grid transition-[grid-template-rows] duration-400
            ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="grid gap-6 pt-5 pb-1 sm:grid-cols-2 lg:grid-cols-4">
              {/* pointure */}
              <fieldset>
                <legend className="eyebrow mb-2.5">Pointure</legend>
                <div className="flex flex-wrap gap-1.5">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      aria-pressed={sizes.includes(size)}
                      onClick={() => toggle(size, sizes, setSizes)}
                      className={`h-9 min-w-10 rounded-md border text-xs font-semibold
                        transition-all duration-250 ${
                          sizes.includes(size)
                            ? "border-accent bg-accent-soft text-accent-2"
                            : "border-line text-fg-2 hover:border-line-strong hover:text-fg"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                  {sizeOptions.length === 0 && (
                    <span className="text-xs text-fg-3">Aucune pointure</span>
                  )}
                </div>
              </fieldset>

              {/* couleur */}
              <fieldset>
                <legend className="eyebrow mb-2.5">Couleur</legend>
                <div className="flex flex-wrap gap-1.5">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      aria-pressed={colors.includes(color.name)}
                      onClick={() => toggle(color.name, colors, setColors)}
                      title={color.name}
                      className={`inline-flex h-9 items-center gap-2 rounded-md border px-2.5
                        text-xs transition-all duration-250 ${
                          colors.includes(color.name)
                            ? "border-accent bg-accent-soft text-accent-2"
                            : "border-line text-fg-2 hover:border-line-strong hover:text-fg"
                        }`}
                    >
                      <span
                        className="size-3.5 rounded-full border border-black/15"
                        style={{
                          background: color.accentHex
                            ? `linear-gradient(135deg, ${color.hex} 55%, ${color.accentHex} 55%)`
                            : color.hex,
                        }}
                      />
                      {color.name}
                    </button>
                  ))}
                  {colorOptions.length === 0 && (
                    <span className="text-xs text-fg-3">Aucun coloris</span>
                  )}
                </div>
              </fieldset>

              {/* type */}
              <fieldset>
                <legend className="eyebrow mb-2.5">Catégorie</legend>
                <div className="flex flex-wrap gap-1.5">
                  {typeOptions.map((type) => (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={types.includes(type)}
                      onClick={() => toggle(type, types, setTypes)}
                      className={chip(types.includes(type))}
                    >
                      {type}
                    </button>
                  ))}
                  {typeOptions.length === 0 && (
                    <span className="text-xs text-fg-3">Aucune catégorie</span>
                  )}
                </div>
              </fieldset>

              {/* prix + disponibilité */}
              <fieldset>
                <legend className="eyebrow mb-2.5">Prix & disponibilité</legend>

                {maxPrice > 0 && (
                  <div className="mb-3">
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      step={100}
                      value={priceCap ?? maxPrice}
                      onChange={(event) => setPriceCap(Number(event.target.value))}
                      aria-label="Prix maximum"
                      className="w-full accent-[color:var(--color-accent)]"
                    />
                    <p className="mt-1 text-xs text-fg-3">
                      Jusqu’à {formatPrice(priceCap ?? maxPrice)}
                    </p>
                  </div>
                )}

                <label className="inline-flex cursor-pointer items-center gap-2.5 text-[0.8125rem] text-fg-2">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(event) => setInStockOnly(event.target.checked)}
                    className="size-4 accent-[color:var(--color-accent)]"
                  />
                  En stock uniquement
                </label>
              </fieldset>
            </div>

            {activeCount > 0 && (
              <div className="flex items-center gap-3 pt-4 pb-1">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 text-xs text-fg-2
                    transition-colors hover:text-fg"
                >
                  <X size={13} />
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------- résultats */}
      {visible.length > 0 ? (
        <ProductGrid products={visible} columns={columns} priorityCount={2} />
      ) : (
        <Reveal>
          <div className="surface rounded-lg px-6 py-16 text-center">
            <p className="mb-2 font-display text-lg font-bold uppercase">
              Aucun produit ne correspond
            </p>
            <p className="mx-auto mb-6 max-w-sm text-sm text-fg-2">
              Élargissez votre sélection : retirez une pointure, une couleur ou augmentez
              le prix maximum.
            </p>
            <button type="button" onClick={reset} className="btn btn-secondary h-10 text-[0.6875rem]">
              Réinitialiser les filtres
            </button>
          </div>
        </Reveal>
      )}
    </div>
  );
}
