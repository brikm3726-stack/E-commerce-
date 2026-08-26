"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { useStore } from "@/context/StoreProvider";

/** Notifications empilées en bas à droite (bas d'écran sur mobile). */
export function Toaster() {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[90] flex flex-col
        items-stretch gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[22rem]"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="anim-toast surface pointer-events-auto flex items-center gap-3
            rounded-lg p-3 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.85)]"
        >
          {toast.image ? (
            <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-ink">
              <Image
                src={toast.image}
                alt=""
                fill
                sizes="44px"
                className="object-contain"
              />
            </div>
          ) : (
            <div className="grid size-11 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-2">
              <Check size={17} />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-[0.8125rem] font-semibold text-fg">{toast.title}</p>
            {toast.detail && (
              <p className="truncate text-xs text-fg-2">{toast.detail}</p>
            )}
          </div>

          {toast.href && (
            <Link
              href={toast.href}
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 text-[0.6875rem] font-semibold tracking-[0.1em]
                uppercase text-accent-2 hover:text-fg"
            >
              Voir
            </Link>
          )}

          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Fermer la notification"
            className="shrink-0 text-fg-3 transition-colors hover:text-fg"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
