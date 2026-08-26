import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/collection/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getNewArrivals, totalStock } from "@/lib/catalog";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Nouveautés — New Drop",
  description:
    "Les dernières arrivées STEP UP : sneakers et pièces streetwear tout juste ajoutées au catalogue.",
  alternates: { canonical: "/nouveautes" },
};

export default function NouveautesPage() {
  const arrivals = getNewArrivals();
  const [feature, ...rest] = arrivals;

  return (
    <>
      <PageHeader
        eyebrow="New drop"
        title="Nouveautés"
        description="Les pièces les plus récemment reçues et contrôlées. Dès qu’une paire arrive en boutique, elle apparaît ici."
        crumbs={[{ label: "Nouveautés" }]}
        meta={`Mis à jour le ${formatDate(arrivals[0]?.createdAt ?? "2026-08-24")}`}
      />

      {/* ================================================ pièce en vedette == */}
      {feature && (
        <section className="container-page pt-10 md:pt-14" aria-label="Dernière arrivée">
          <Reveal>
            <Link
              href={`/produit/${feature.slug}`}
              className="surface group relative grid overflow-hidden rounded-xl
                lg:grid-cols-[1.05fr_1fr]"
            >
              {/* visuel */}
              <div className="relative aspect-4/3 overflow-hidden lg:aspect-auto lg:min-h-[30rem]">
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 45%, rgba(22,119,255,0.22), transparent 62%)",
                  }}
                />
                <Image
                  src={feature.cutout.src2x ?? feature.cutout.src}
                  alt={feature.cutout.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 92vw, 50vw"
                  className="object-contain p-6 transition-transform duration-[1100ms]
                    ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 md:p-10"
                  style={{ filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.7))" }}
                />

                <span className="badge badge-accent absolute left-5 top-5">
                  New — {formatDate(feature.createdAt)}
                </span>
              </div>

              {/* texte */}
              <div className="flex flex-col justify-center gap-5 p-7 md:p-12">
                <div>
                  <p className="eyebrow mb-3">Dernière arrivée</p>
                  <h2 className="display text-[clamp(2.2rem,6vw,3.6rem)]">
                    {feature.name}
                  </h2>
                  <p className="mt-2 text-sm text-fg-2">{feature.subtitle}</p>
                </div>

                <Rating value={feature.rating} reviews={feature.reviews} size="md" />

                <p className="max-w-md text-[0.875rem] leading-relaxed text-fg-2">
                  {feature.description}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  {feature.sizes.map((size) => (
                    <span
                      key={size.size}
                      className="rounded-md border border-line px-2.5 py-1.5 text-xs
                        font-semibold text-fg-2"
                    >
                      {size.size}
                    </span>
                  ))}
                  <span className="ml-1 text-xs text-fg-3">
                    {totalStock(feature)} paire{totalStock(feature) > 1 ? "s" : ""} en stock
                  </span>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4 pt-1">
                  <Price value={feature.price} oldValue={feature.oldPrice} size="lg" />

                  <span
                    className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold
                      tracking-[0.12em] uppercase text-accent-2"
                  >
                    Voir la fiche
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1.5"
                    />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        </section>
      )}

      {/* ==================================================== le reste ===== */}
      {rest.length > 0 && (
        <section className="container-page py-16 md:py-20" aria-labelledby="autres-titre">
          <Reveal>
            <SectionHeader
              eyebrow="Également arrivés"
              title="Le reste du drop"
              action={{ label: "Toute la collection", href: "/sneakers" }}
            />
          </Reveal>
          <h2 id="autres-titre" className="sr-only">
            Le reste du drop
          </h2>
          <ProductGrid products={rest} className="mt-10" priorityCount={0} />
        </section>
      )}
    </>
  );
}
