"use client";

import { X } from "lucide-react";
import { useModalBehavior } from "@/hooks/useModalBehavior";

/** Correspondance pointure EU / longueur de pied, pour le modèle McQUENNE. */
const ROWS = [
  { eu: "39", cm: "24,5", uk: "6", us: "6,5" },
  { eu: "40", cm: "25,0", uk: "6,5", us: "7,5" },
  { eu: "41", cm: "25,5", uk: "7,5", us: "8" },
  { eu: "42", cm: "26,5", uk: "8", us: "9" },
  { eu: "43", cm: "27,0", uk: "9", us: "10" },
  { eu: "44", cm: "28,0", uk: "9,5", us: "10,5" },
  { eu: "45", cm: "28,5", uk: "10,5", us: "11" },
];

export function SizeGuide({ onClose }: { onClose: () => void }) {
  useModalBehavior(true, onClose);

  return (
    <div className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Fermer le guide des tailles"
        onClick={onClose}
        className="anim-fade-in absolute inset-0 bg-ink/85 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-tailles-titre"
        className="anim-scale-in glass-panel relative w-full max-w-lg rounded-t-xl
          border border-line sm:rounded-xl"
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2
            id="guide-tailles-titre"
            className="font-display text-base font-bold tracking-tight uppercase"
          >
            Guide des tailles
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="-mr-2 grid size-9 place-items-center rounded-md text-fg-2
              transition-colors hover:bg-black/[0.05] hover:text-fg"
          >
            <X size={18} />
          </button>
        </header>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
          <p className="mb-5 text-[0.8125rem] leading-relaxed text-fg-2">
            Le modèle McQUENNE chausse normalement : prenez votre pointure habituelle.
            En cas d’hésitation entre deux tailles, choisissez la plus grande.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left">
                  <th scope="col" className="py-2.5 pr-3 text-xs font-semibold tracking-[0.1em] uppercase text-fg-2">
                    EU
                  </th>
                  <th scope="col" className="py-2.5 pr-3 text-xs font-semibold tracking-[0.1em] uppercase text-fg-2">
                    Pied (cm)
                  </th>
                  <th scope="col" className="py-2.5 pr-3 text-xs font-semibold tracking-[0.1em] uppercase text-fg-2">
                    UK
                  </th>
                  <th scope="col" className="py-2.5 text-xs font-semibold tracking-[0.1em] uppercase text-fg-2">
                    US
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {ROWS.map((row) => (
                  <tr key={row.eu}>
                    <td className="py-2.5 pr-3 font-semibold">{row.eu}</td>
                    <td className="py-2.5 pr-3 text-fg-2">{row.cm}</td>
                    <td className="py-2.5 pr-3 text-fg-2">{row.uk}</td>
                    <td className="py-2.5 text-fg-2">{row.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="surface-2 mt-5 rounded-md p-4">
            <p className="mb-1.5 text-[0.8125rem] font-semibold text-fg">
              Comment mesurer votre pied
            </p>
            <ol className="list-inside list-decimal space-y-1 text-[0.8125rem] text-fg-2">
              <li>Posez votre pied sur une feuille, talon contre le mur.</li>
              <li>Marquez l’extrémité du plus long orteil.</li>
              <li>Mesurez la distance en centimètres, le soir de préférence.</li>
            </ol>
          </div>

          <p className="mt-4 text-xs text-fg-3">
            Si la pointure reçue ne convient pas, l’échange est possible sous 48 h,
            dans la limite du stock disponible.
          </p>
        </div>
      </div>
    </div>
  );
}
