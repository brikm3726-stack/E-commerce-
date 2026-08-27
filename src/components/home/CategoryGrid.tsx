import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/data/products";
import { getByCategory } from "@/lib/catalog";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { withBasePath } from "@/lib/base-path";

/**
 * Catégories de la page d'accueil. Seules celles qui ont réellement du stock
 * sont affichées : aujourd'hui les sneakers. Les rayons en préparation
 * n'apparaissent pas tant qu'ils sont vides.
 */
export function CategoryGrid() {
  const open = CATEGORIES.map((category) => ({
    ...category,
    count: getByCategory(category.slug).length,
  })).filter((category) => category.count > 0);

  if (open.length === 0) return null;

  return (
    <section className="container-page py-16 md:py-24" aria-labelledby="categories-titre">
      <Reveal>
        <SectionHeader
          eyebrow="Rayons"
          title="Explorez nos catégories"
          description="Chaque univers est sélectionné avec la même exigence : de belles pièces, au bon prix, livrées vite."
        />
      </Reveal>

      <h2 id="categories-titre" className="sr-only">
        Catégories
      </h2>

      <div
        className={`mt-10 grid gap-4 ${open.length > 1 ? "md:grid-cols-2" : ""}`}
      >
        {open.map((category, index) => (
          <Reveal key={category.slug} delay={index * 90}>
            <Link
              href={category.href}
              className="group relative flex h-full flex-col justify-end overflow-hidden
                rounded-[1.25rem] border border-line bg-white transition-all duration-500
                hover:border-accent-line hover:shadow-[0_28px_70px_-32px_rgba(26,20,6,0.35)]"
            >
              {/* visuel 16:9 : la basket occupe la droite, le texte la gauche */}
              <div className="relative aspect-4/3 w-full sm:aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={withBasePath(category.image)}
                  alt=""
                  className="absolute inset-0 size-full object-cover transition-transform
                    duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                {/* voile clair côté texte, pour que le titre reste lisible */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.7) 34%, rgba(255,255,255,0) 62%)",
                  }}
                />

                <div className="absolute inset-y-0 left-0 flex max-w-[62%] flex-col justify-center p-6 sm:max-w-[48%] sm:p-10">
                  <span
                    className="mb-3 inline-flex h-6 w-fit items-center rounded-[6px] border
                      border-line bg-white/80 px-2.5 text-[0.625rem] font-bold
                      uppercase tracking-[0.12em] text-fg-2"
                  >
                    {category.count} modèle{category.count > 1 ? "s" : ""}
                  </span>

                  <h3 className="display text-[clamp(1.6rem,3.6vw,2.4rem)] text-fg">
                    {category.label}
                  </h3>

                  <p className="mt-2.5 line-clamp-3 text-[0.8125rem] leading-relaxed text-fg-2">
                    {category.description}
                  </p>

                  <span
                    className="mt-5 inline-flex items-center gap-2 text-[0.6875rem]
                      font-bold tracking-[0.12em] uppercase text-accent-2"
                  >
                    Découvrir
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-1.5"
                    />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
