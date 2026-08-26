import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/data/site";

interface EmptyCategoryProps {
  /** sous-familles prévues pour cette catégorie */
  types: string[];
  label: string;
}

/**
 * Catégorie encore vide. On l'assume : rien n'est inventé, les sous-familles
 * prévues sont annoncées et le client est redirigé vers ce qui est réellement
 * en stock.
 */
export function EmptyCategory({ types, label }: EmptyCategoryProps) {
  return (
    <Reveal>
      <div className="surface relative overflow-hidden rounded-xl px-6 py-14 text-center md:px-14 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(560px 260px at 50% 0%, rgba(22,119,255,0.14), transparent 70%)",
          }}
        />

        <div className="relative">
          <span className="badge badge-accent mb-5">En préparation</span>

          <h2 className="display mx-auto max-w-xl text-[clamp(1.7rem,4.6vw,2.6rem)]">
            La collection {label.toLowerCase()} arrive
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-fg-2">
            Nous appliquons la même règle qu’aux sneakers : rien n’est mis en ligne tant
            que la pièce n’est pas reçue et vérifiée. Voici ce qui est prévu.
          </p>

          <ul className="mx-auto mt-8 flex max-w-lg flex-wrap justify-center gap-2">
            {types.map((type) => (
              <li
                key={type}
                className="rounded-md border border-line bg-white/3 px-3.5 py-2
                  text-[0.8125rem] text-fg-2"
              >
                {type}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/sneakers" className="btn btn-primary">
              Voir les sneakers en stock
              <ArrowRight size={15} />
            </Link>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Être prévenu de l’arrivage
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
