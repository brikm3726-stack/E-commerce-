import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/data/products";
import { getByCategory } from "@/lib/catalog";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function CategoryGrid() {
  return (
    <section className="container-page py-16 md:py-24" aria-labelledby="categories-titre">
      <Reveal>
        <SectionHeader
          eyebrow="Catégories"
          title="Trouvez votre style"
          description="Trois univers, une même exigence : des pièces sobres, bien coupées et faites pour durer."
        />
      </Reveal>

      <h2 id="categories-titre" className="sr-only">
        Catégories
      </h2>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {CATEGORIES.map((category, index) => {
          const count = getByCategory(category.slug).length;

          return (
            <Reveal key={category.slug} delay={index * 90}>
              <Link
                href={category.href}
                className="surface group relative flex h-full min-h-[19rem] flex-col
                  justify-end overflow-hidden rounded-lg p-6 transition-all duration-500
                  hover:border-line-strong hover:shadow-[0_24px_70px_-30px_rgba(22,119,255,0.45)]"
              >
                {/* visuel */}
                <div className="absolute inset-0">
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 92vw, 32vw"
                    className={`object-contain p-8 transition-transform duration-[1100ms]
                      ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110
                      ${count === 0 ? "opacity-35" : "opacity-90"}`}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 40%, rgba(22,119,255,0.16), transparent 60%)",
                    }}
                  />
                </div>

                <div className="relative">
                  <span className="badge mb-3">
                    {count > 0
                      ? `${count} modèle${count > 1 ? "s" : ""}`
                      : "Bientôt disponible"}
                  </span>

                  <h3 className="display text-2xl">{category.label}</h3>

                  <p className="mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed text-fg-2">
                    {category.description}
                  </p>

                  <span
                    className="mt-4 inline-flex items-center gap-2 text-[0.6875rem]
                      font-semibold tracking-[0.12em] uppercase text-accent-2"
                  >
                    Découvrir
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-1.5"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
