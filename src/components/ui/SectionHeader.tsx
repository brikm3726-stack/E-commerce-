import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** lien « tout voir » aligné à droite sur grand écran */
  action?: { label: string; href: string };
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between
        ${centered ? "sm:flex-col sm:items-center" : ""} ${className}`}
    >
      <div className={centered ? "text-center" : ""}>
        {eyebrow && (
          <p className="eyebrow mb-3 flex items-center gap-2.5">
            {!centered && <span className="h-px w-6 bg-accent-line" aria-hidden="true" />}
            {eyebrow}
          </p>
        )}

        <h2 className="display text-[clamp(1.9rem,5.2vw,3rem)]">{title}</h2>

        {description && (
          <p
            className={`mt-3 max-w-xl text-sm leading-relaxed text-fg-2
              ${centered ? "mx-auto" : ""}`}
          >
            {description}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-2 text-[0.75rem]
            font-semibold tracking-[0.1em] uppercase text-fg-2 transition-colors hover:text-fg"
        >
          {action.label}
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
}
