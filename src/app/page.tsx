import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Editorial } from "@/components/home/Editorial";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { getFeatured, getNewArrivals } from "@/lib/catalog";
import { SITE } from "@/data/site";

export default function HomePage() {
  const featured = getFeatured();
  const bestSellers = [...featured].sort((a, b) => b.reviews - a.reviews);
  const newArrivals = getNewArrivals(4);

  return (
    <>
      <Hero products={featured} />

      <Marquee />

      <CategoryGrid />

      {/* ============================================== les plus demandés === */}
      <section
        className="container-page py-16 md:py-24"
        aria-labelledby="best-sellers-titre"
      >
        <Reveal>
          <SectionHeader
            eyebrow="Best-sellers"
            title="Les plus demandés"
            description="Les modèles qui partent le plus vite. Stock réel, une paire par pointure."
            action={{ label: "Toute la collection", href: "/sneakers" }}
          />
        </Reveal>

        <h2 id="best-sellers-titre" className="sr-only">
          Les plus demandés
        </h2>

        <ProductGrid products={bestSellers} className="mt-10" priorityCount={2} />
      </section>

      <Editorial />

      {/* =================================================== nouveautés ==== */}
      <section className="container-page py-16 md:py-20" aria-labelledby="new-drop-titre">
        <Reveal>
          <SectionHeader
            eyebrow="New drop"
            title="Dernières arrivées"
            description="Les pièces les plus récemment ajoutées au catalogue."
            action={{ label: "Voir les nouveautés", href: "/nouveautes" }}
          />
        </Reveal>

        <h2 id="new-drop-titre" className="sr-only">
          Dernières arrivées
        </h2>

        <ProductGrid products={newArrivals} className="mt-10" priorityCount={0} />
      </section>

      {/* ================================================== appel final ==== */}
      <section className="container-page pb-8">
        <Reveal>
          <div className="surface relative overflow-hidden rounded-xl px-6 py-14 text-center md:px-16 md:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(600px 300px at 50% 0%, rgba(22,119,255,0.16), transparent 70%)",
              }}
            />

            <div className="relative">
              <p className="eyebrow mb-4">Une question avant de commander&nbsp;?</p>
              <h2 className="display mx-auto max-w-2xl text-[clamp(1.8rem,5vw,2.8rem)]">
                On vous répond en quelques minutes
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-fg-2">
                Pointure, disponibilité, délai de livraison dans votre wilaya : écrivez-nous,
                on vérifie le stock avec vous avant de valider.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Écrire sur WhatsApp
                  <ArrowRight size={15} />
                </a>
                <Link href="/contact" className="btn btn-secondary">
                  Page contact
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
