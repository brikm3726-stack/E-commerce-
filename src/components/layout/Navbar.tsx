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
            className="-ml-2 grid size-10 place-items-center rounded-md text-fg
              transition-colors hover:bg-white/5 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label="STEP UP — accueil"
          >
            <span
              className="grid size-8 place-items-center rounded-md border border-accent-line
                bg-accent-soft transition-all duration-300 group-hover:bg-accent/25"
              aria-hidden="true"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 11.5L7 7.5L9.5 10L13.5 4.5"
                  stroke="#2F8CFF"
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </svg>
            </span>
            <span className="font-display text-lg font-extrabold tracking-[-0.03em] [word-spacing:0.14em] uppercase">
              Step Up
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
                    isActive(link.href) ? "text-fg" : "text-fg-2 hover:text-fg"
                  }`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-3.5 -bottom-0.5 h-px bg-accent-2
                    transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
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
            className="grid size-10 place-items-center rounded-md text-fg-2
              transition-colors duration-300 hover:bg-white/5 hover:text-fg"
          >
            <Search size={18} />
          </button>

          <Link
            href="/favoris"
            aria-label={`Mes favoris${hydrated && wishlist.length ? ` (${wishlist.length})` : ""}`}
            className="relative hidden size-10 place-items-center rounded-md text-fg-2
              transition-colors duration-300 hover:bg-white/5 hover:text-fg sm:grid"
          >
            <Heart size={18} />
            {hydrated && wishlist.length > 0 && (
              <span
                className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-accent-2"
                aria-hidden="true"
              />
            )}
          </Link>

          <Link
            href="/compte"
            aria-label="Mon compte"
            className="hidden size-10 place-items-center rounded-md text-fg-2
              transition-colors duration-300 hover:bg-white/5 hover:text-fg sm:grid"
          >
            <User size={18} />
          </Link>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Panier${hydrated && cartCount ? ` — ${cartCount} article(s)` : " vide"}`}
            className="relative -mr-2 grid size-10 place-items-center rounded-md text-fg
              transition-colors duration-300 hover:bg-white/5"
          >
            <ShoppingBag size={19} />
            {hydrated && cartCount > 0 && (
              <span
                className={`absolute -right-0.5 -top-0.5 grid min-w-4.5 place-items-center
                  rounded-full bg-accent px-1 text-[0.625rem] font-bold text-white
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
