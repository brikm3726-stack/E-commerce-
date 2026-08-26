import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
  /** compteur affiché à droite (nombre de produits) */
  meta?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs = [],
  meta,
}: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(700px 260px at 20% 0%, rgba(22,119,255,0.14), transparent 70%)",
        }}
      />

      <div className="container-page relative py-10 md:py-14">
        {crumbs.length > 0 && (
          <nav aria-label="Fil d’Ariane" className="mb-5">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-fg-3">
              <li>
                <Link href="/" className="transition-colors hover:text-fg">
                  Accueil
                </Link>
              </li>
              {crumbs.map((crumb) => (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  <ChevronRight size={12} aria-hidden="true" />
                  {crumb.href ? (
                    <Link href={crumb.href} className="transition-colors hover:text-fg">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-fg-2">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {eyebrow && (
              <p className="eyebrow mb-3 flex items-center gap-2.5">
                <span className="h-px w-6 bg-accent-line" aria-hidden="true" />
                {eyebrow}
              </p>
            )}

            <h1 className="display text-[clamp(2.2rem,7vw,4rem)]">{title}</h1>

            {description && (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-2">
                {description}
              </p>
            )}
          </div>

          {meta && <p className="shrink-0 text-xs text-fg-3">{meta}</p>}
        </div>
      </div>
    </header>
  );
}
