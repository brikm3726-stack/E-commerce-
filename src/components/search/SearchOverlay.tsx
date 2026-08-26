"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useStore } from "@/context/StoreProvider";
import { searchProducts } from "@/lib/catalog";
import { CATEGORIES } from "@/data/products";
import { formatPrice } from "@/lib/format";

const SUGGESTIONS = [
  "sneaker blanche",
  "sneaker noire",
  "step one",
  "pointure 41",
  "nouveautés",
];

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setSearchOpen(false);
  }, [pathname, setSearchOpen]);

  useEffect(() => {
    if (searchOpen) {
      // laisse l'animation démarrer avant de prendre le focus
      const id = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => window.clearTimeout(id);
    }
    setQuery("");
  }, [searchOpen]);

  const results = useMemo(() => searchProducts(query), [query]);

  const matchedCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return CATEGORIES.filter((c) => c.label.toLowerCase().includes(q));
  }, [query]);

  if (!searchOpen) return null;

  const hasQuery = query.trim().length > 0;
  const empty = hasQuery && results.length === 0 && matchedCategories.length === 0;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Fermer la recherche"
        onClick={() => setSearchOpen(false)}
        className="anim-fade-in absolute inset-0 bg-ink/85 backdrop-blur-md"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Recherche"
        className="anim-fade-up relative mx-auto flex h-full max-w-3xl flex-col px-4 pt-4 sm:pt-16"
      >
        {/* ------------------------------------------------------ champ */}
        <div className="glass-panel flex items-center gap-3 rounded-lg border border-line px-4">
          <Search size={19} className="shrink-0 text-fg-3" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher une paire, une couleur, une pointure…"
            aria-label="Rechercher"
            className="h-14 flex-1 bg-transparent text-base outline-none
              [&::-webkit-search-cancel-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Fermer la recherche"
            className="-mr-1.5 grid size-9 shrink-0 place-items-center rounded-md
              text-fg-3 transition-colors hover:bg-white/5 hover:text-fg"
          >
            <X size={18} />
          </button>
        </div>

        {/* --------------------------------------------------- résultats */}
        <div className="no-scrollbar mt-3 flex-1 overflow-y-auto pb-8">
          {!hasQuery && (
            <div className="anim-fade-in space-y-6 px-1 pt-6">
              <div>
                <p className="eyebrow mb-3">Suggestions</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setQuery(suggestion)}
                      className="rounded-md border border-line bg-white/3 px-3 py-2
                        text-[0.8125rem] text-fg-2 transition-all duration-300
                        hover:border-accent-line hover:bg-accent-soft hover:text-accent-2"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="eyebrow mb-3">Catégories</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {CATEGORIES.map((category) => (
                    <Link
                      key={category.slug}
                      href={category.href}
                      className="surface flex items-center justify-between rounded-md
                        px-3.5 py-3 text-sm transition-colors hover:border-line-strong"
                    >
                      {category.label}
                      <ArrowUpRight size={15} className="text-fg-3" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {hasQuery && (
            <div className="anim-fade-in space-y-5 pt-4">
              {results.length > 0 && (
                <div>
                  <p className="eyebrow mb-2 px-1">
                    Produits · {results.length} résultat{results.length > 1 ? "s" : ""}
                  </p>
                  <ul className="space-y-1.5">
                    {results.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={`/produit/${product.slug}`}
                          className="surface group flex items-center gap-3.5 rounded-lg p-2.5
                            transition-all duration-300 hover:border-line-strong"
                        >
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-ink-2">
                            <Image
                              src={product.cutout.src}
                              alt=""
                              fill
                              sizes="56px"
                              className="object-contain p-1 transition-transform
                                duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-display text-sm font-bold uppercase">
                              {product.name}
                            </p>
                            <p className="truncate text-xs text-fg-2">{product.subtitle}</p>
                          </div>
                          <span className="shrink-0 text-sm font-semibold">
                            {formatPrice(product.price)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {matchedCategories.length > 0 && (
                <div>
                  <p className="eyebrow mb-2 px-1">Catégories</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {matchedCategories.map((category) => (
                      <Link
                        key={category.slug}
                        href={category.href}
                        className="surface flex items-center justify-between rounded-md
                          px-3.5 py-3 text-sm transition-colors hover:border-line-strong"
                      >
                        {category.label}
                        <ArrowUpRight size={15} className="text-fg-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {empty && (
                <div className="surface rounded-lg px-5 py-10 text-center">
                  <p className="mb-1.5 font-display text-lg font-bold uppercase">
                    Aucun résultat
                  </p>
                  <p className="mx-auto max-w-sm text-sm text-fg-2">
                    Rien ne correspond à «&nbsp;{query}&nbsp;». Essayez «&nbsp;sneaker&nbsp;»,
                    une couleur ou une pointure.
                  </p>
                  <Link
                    href="/sneakers"
                    className="btn btn-secondary mt-5 h-10 text-[0.6875rem]"
                  >
                    Voir toute la collection
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
