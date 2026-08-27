import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/collection/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Reveal } from "@/components/ui/Reveal";
import { getByCategory } from "@/lib/catalog";
import { withBasePath } from "@/lib/base-path";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "La boutique EcomDZ : les sneakers McQUENNE disponibles en Algérie. Stock réel, paiement à la livraison.",
  alternates: { canonical: "/collections" },
};

/** Boutique : seuls les produits réellement disponibles sont affichés.
 *  Aujourd'hui, les trois coloris McQUENNE. */
export default function CollectionsPage() {
  const sneakers = getByCategory("sneakers");

  return (
    <>
      <PageHeader
        eyebrow="Boutique"
        title="Nos produits"
        description="Ce qui est en ligne est en stock. Aujourd’hui, la sneaker McQUENNE en trois coloris."
        crumbs={[{ label: "Boutique" }]}
        meta={`${sneakers.length} modèle${sneakers.length > 1 ? "s" : ""} disponible${
          sneakers.length > 1 ? "s" : ""
        }`}
      />

      <div className="container-page py-10 md:py-14">
        {/* ============================================== bannière McQUENNE */}
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[1.5rem] border border-line bg-white
              shadow-[0_20px_60px_-34px_rgba(26,20,6,0.3)]"
          >
            <div className="relative aspect-4/3 w-full sm:aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={withBasePath("/mc-12.webp")}
                alt="Sneaker McQUENNE blanche à semelle surélevée, sur fond studio clair"
                width={1536}
                height={864}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 size-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.72) 36%, rgba(255,255,255,0) 64%)",
                }}
              />

              <div className="absolute inset-y-0 left-0 flex max-w-[66%] flex-col justify-center p-6 sm:max-w-[52%] sm:p-10 lg:p-14">
                <p className="eyebrow mb-3">La sélection du moment</p>

                <h2 className="display text-[clamp(1.8rem,4.4vw,3.2rem)]">McQUENNE</h2>

                <p className="mt-3 max-w-sm text-[0.8125rem] leading-relaxed text-fg-2 sm:text-sm">
                  Une silhouette basse à semelle surélevée, montée en cuir lisse.
                  Trois coloris, stock réel, une paire par pointure.
                </p>

                <Link
                  href="/sneakers"
                  className="btn btn-primary mt-6 w-fit"
                  aria-label="Explorer les sneakers McQUENNE"
                >
                  Explorer
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        {/* =================================================== les 3 coloris */}
        <section className="mt-14 md:mt-20" aria-labelledby="modeles-titre">
          <Reveal>
            <h2 id="modeles-titre" className="display text-[clamp(1.5rem,3.4vw,2rem)]">
              Les {sneakers.length} modèles
            </h2>
            <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-fg-2">
              La même silhouette, déclinée en trois finitions. Cliquez sur un modèle
              pour voir les pointures encore disponibles.
            </p>
          </Reveal>

          <ProductGrid products={sneakers} className="mt-8" priorityCount={3} />
        </section>
      </div>
    </>
  );
}
