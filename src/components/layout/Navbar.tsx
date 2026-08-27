"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { NAV_LINKS } from "@/data/site";
import { useStore } from "@/context/StoreProvider";

export function Navbar() {
  const pathname = usePathname();
  const { cartCount, wishlist, hydrated, setCartOpen, setSearchOpen, setMenuOpen } =
    useStore();
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(false);

  // passage en verre dépoli après quelques pixels de défilement
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // petite pulsation du compteur à chaque ajout
  useEffect(() => {
    if (!hydrated || cartCount === 0) return;
    setBump(true);
    const id = window.setTimeout(() => setBump(false), 420);
    return () => window.clearTimeout(id);
  }, [cartCount, hydrated]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /** En haut de l'accueil, le header flotte sur le bandeau sombre de la
   *  maquette : il passe en blanc pour rester lisible. Dès qu'on défile, il
   *  reprend le verre jaune et l'encre foncée. */
  const overHero = pathname === "/" && !scrolled;
  const iconTone = overHero
    ? "text-white/80 hover:bg-white/15 hover:text-white"
    : "text-fg-2 hover:bg-black/[0.05] hover:text-fg";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500
        ${scrolled ? "glass py-0" : "border-b border-transparent py-1.5"}`}
    >
      <nav
        className="container-page flex h-16 items-center justify-between gap-4 md:h-18"
        aria-label="Navigation principale"
      >
        {/* ------------------------------------------------------- gauche */}
        <div className="flex items-center gap-2 md:gap-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            className={`-ml-2 grid size-10 place-items-center rounded-md transition-colors
              lg:hidden ${
                overHero ? "text-white hover:bg-white/15" : "text-fg hover:bg-black/[0.05]"
              }`}
          >
            <Menu size={20} />
          </button>

          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label="EcomDZ — accueil"
          >
            <span
              className={`grid size-9 place-items-center rounded-lg transition-transform
                duration-300 group-hover:-rotate-6 ${
                  overHero
                    ? "bg-white/95 shadow-[0_6px_18px_-8px_rgba(26,20,6,0.6)]"
                    : "bg-[#1b1710] shadow-[0_6px_18px_-8px_rgba(26,20,6,0.9)]"
                }`}
              aria-hidden="true"
            >
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 4.5h9M3 8h9M3 11.5h6"
                  stroke={overHero ? "#1b1710" : "#f5b301"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="font-display text-xl font-extrabold tracking-[-0.03em]">
              <span className={overHero ? "text-white" : "text-fg"}>Ecom</span>
              <span className={overHero ? "text-accent" : "text-accent-2"}>DZ</span>
            </span>
          </Link>
        </div>

        {/* -------------------------------------------------------- centre */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`relative rounded-md px-3.5 py-2 text-[0.8125rem] font-medium
                  transition-colors duration-300 ${
                    overHero
                      ? isActive(link.href)
                        ? "text-white"
                        : "text-white/75 hover:text-white"
                      : isActive(link.href)
                        ? "text-fg"
                        : "text-fg-2 hover:text-fg"
                  }`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-3.5 -bottom-0.5 h-px transition-transform
                    duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${overHero ? "bg-accent" : "bg-accent-2"}
                    ${isActive(link.href) ? "scale-x-100" : "scale-x-0"}`}
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* --------------------------------------------------------- droite */}
        <div className="flex items-center gap-0.5 md:gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Rechercher un produit"
            className={`grid size-10 place-items-center rounded-md
              transition-colors duration-300 ${iconTone}`}
          >
            <Search size={18} />
          </button>

          <Link
            href="/favoris"
            aria-label={`Mes favoris${hydrated && wishlist.length ? ` (${wishlist.length})` : ""}`}
            className={`relative hidden size-10 place-items-center rounded-md
              transition-colors duration-300 sm:grid ${iconTone}`}
          >
            <Heart size={18} />
            {hydrated && wishlist.length > 0 && (
              <span
                className={`absolute right-1.5 top-1.5 size-1.5 rounded-full ${overHero ? "bg-white" : "bg-accent-2"}`}
                aria-hidden="true"
              />
            )}
          </Link>

          <Link
            href="/compte"
            aria-label="Mon compte"
            className={`hidden size-10 place-items-center rounded-md
              transition-colors duration-300 sm:grid ${iconTone}`}
          >
            <User size={18} />
          </Link>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Panier${hydrated && cartCount ? ` — ${cartCount} article(s)` : " vide"}`}
            className={`relative -mr-2 grid size-10 place-items-center rounded-md
              transition-colors duration-300 ${
                overHero ? "text-white hover:bg-white/15" : "text-fg hover:bg-black/[0.05]"
              }`}
          >
            <ShoppingBag size={19} />
            {hydrated && cartCount > 0 && (
              <span
                className={`absolute -right-0.5 -top-0.5 grid min-w-4.5 place-items-center
                  rounded-full bg-accent px-1 text-[0.625rem] font-bold text-[#1b1710]
                  transition-transform duration-300 ${bump ? "scale-125" : "scale-100"}`}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
