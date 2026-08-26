"use client";

import { useEffect } from "react";

/**
 * Comportement commun à toute fenêtre modale locale : fermeture par Échap et
 * blocage du défilement de la page en arrière-plan.
 *
 * Les panneaux globaux (panier, recherche, menu) sont gérés par le
 * StoreProvider ; ce hook sert aux modales à état local, comme le guide des
 * tailles.
 */
export function useModalBehavior(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const previousPadding = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, [open, onClose]);
}
