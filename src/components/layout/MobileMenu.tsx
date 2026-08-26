"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ArrowRight, Heart, User, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/data/site";
import { useStore } from "@/context/StoreProvider";

export function MobileMenu() {
  const { menuOpen, setMenuOpen } = useStore();
  const pathname = usePathname();

  // la navigation ferme le panneau
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  if (!menuOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] lg:hidden">
      <button
        type="button"
        aria-label="Fermer le menu"
        onClick={() => setMenuOpen(false)}
        className="anim-fade-in absolute inset-0 bg-ink/80 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="anim-slide-up glass-panel absolute inset-x-0 bottom-0 top-0 flex
          flex-col border-r border-line"
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <span className="font-display text-lg font-extrabold tracking-[-0.03em] [word-spacing:0.14em] uppercase">
            Step Up
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Fermer le menu"
            className="-mr-2 grid size-10 place-items-center rounded-md text-fg-2
              transition-colors hover:bg-white/5 hover:text-fg"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Menu mobile">
          <ul className="space-y-1">
            {NAV_LINKS.map((link, index) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <li
                  key={link.href}
                  className="anim-fade-up"
                  style={{ animationDelay: `${index * 45}ms` }}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center justify-between border-b border-line/70
                      py-4 font-display text-2xl font-bold tracking-tight uppercase
                      transition-colors ${active ? "text-accent-2" : "text-fg hover:text-accent-2"}`}
                  >
                    {link.label}
                    <ArrowRight size={18} className="text-fg-3" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 grid grid-cols-2 gap-2.5">
            <Link href="/favoris" className="btn btn-secondary h-11 text-[0.6875rem]">
              <Heart size={15} />
              Favoris
            </Link>
            <Link href="/compte" className="btn btn-secondary h-11 text-[0.6875rem]">
              <User size={15} />
              Compte
            </Link>
          </div>
        </nav>

        <div className="border-t border-line px-5 py-5 text-xs text-fg-3">
          <p className="mb-1 text-fg-2">Une question ?</p>
          <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="link-underline text-fg">
            {SITE.phone}
          </a>
          <p className="mt-3">Livraison 58 wilayas · Paiement à la livraison</p>
        </div>
      </div>
    </div>
  );
}
