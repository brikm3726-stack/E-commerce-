"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

interface PromoCountdownProps {
  /** date ISO de fin de la promotion */
  endsAt: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function computeTimeLeft(endsAt: string): TimeLeft {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
    done: false,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Compte à rebours de promotion. Calculé côté client uniquement (l'heure du
 * serveur au moment du rendu statique n'a pas de sens ici) : la valeur
 * affichée au tout premier rendu est donc figée jusqu'au montage, pour éviter
 * un écart entre le HTML pré-rendu et le premier tick réel.
 */
export function PromoCountdown({ endsAt, className = "" }: PromoCountdownProps) {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(computeTimeLeft(endsAt));
    const id = window.setInterval(() => setTime(computeTimeLeft(endsAt)), 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  if (!time || time.done) return null;

  const units: { label: string; value: number }[] = [
    { label: "Jours", value: time.days },
    { label: "Heures", value: time.hours },
    { label: "Min", value: time.minutes },
    { label: "Sec", value: time.seconds },
  ];

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-md border
        border-[rgba(244,63,94,0.32)] bg-[rgba(244,63,94,0.08)] px-3.5 py-2.5 ${className}`}
      role="timer"
      aria-live="off"
    >
      <Flame size={16} className="shrink-0 text-[color:var(--color-danger)]" aria-hidden="true" />

      <div>
        <p className="text-[0.625rem] font-bold tracking-[0.1em] uppercase text-[color:var(--color-danger)]">
          Promotion — se termine dans
        </p>
        <div className="mt-1 flex items-center gap-1.5" aria-hidden="true">
          {units.map((unit, index) => (
            <span key={unit.label} className="flex items-center gap-1.5">
              <span className="flex flex-col items-center">
                <span className="font-display text-base font-bold tabular-nums leading-none text-fg">
                  {pad(unit.value)}
                </span>
                <span className="mt-0.5 text-[0.5625rem] text-fg-3">{unit.label}</span>
              </span>
              {index < units.length - 1 && (
                <span className="mb-3 text-sm font-bold text-fg-3">:</span>
              )}
            </span>
          ))}
        </div>
        <span className="sr-only">
          {time.days} jours {time.hours} heures {time.minutes} minutes {time.seconds} secondes
          restantes avant la fin de la promotion
        </span>
      </div>
    </div>
  );
}
