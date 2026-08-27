import Link from "next/link";
import { ArrowRight, BadgeCheck, Headphones, ShieldCheck, Truck } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

/** Page d'accueil : vitrine. Aucun produit n'y est affiché — le catalogue
 *  vit sur /collections et /sneakers. */

const REASONS = [
  {
    icon: Truck,
    title: "Livraison partout en Algérie",
    detail: "58 wilayas, à domicile ou au bureau du transporteur.",
  },
  {
    icon: ShieldCheck,
    title: "Paiement sécurisé",
    detail: "Payez à la livraison, en toute confiance.",
  },
  {
    icon: BadgeCheck,
    title: "Produits sélectionnés",
    detail: "Chaque article est contrôlé avant d’être mis en ligne.",
  },
  {
    icon: Headphones,
    title: "Service client disponible",
    detail: "Une question ? On vous répond en quelques minutes.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ==================================================== catégories === */}
      <div id="categories" className="scroll-mt-24">
        <CategoryGrid />
      </div>

      {/* ==================================================== promotions === */}
      <section
        id="promotions"
        className="container-page scroll-mt-24 py-10 md:py-16"
        aria-labelledby="promo-titre"
      >
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[1.6rem] px-6 py-14 text-center md:px-16 md:py-20"
            style={{
              background:
                "linear-gradient(150deg, #ffd15a 0%, #f5b301 45%, #e0a000 100%)",
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(420px 220px at 12% 8%, rgba(255,255,255,0.7), transparent 70%), radial-gradient(520px 260px at 92% 100%, rgba(26,20,6,0.18), transparent 70%)",
              }}
            />
            <div className="relative text-[#1b1710]">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.2em]">
                Offres du moment
              </p>
              <h2
                id="promo-titre"
                className="display mx-auto mt-4 max-w-2xl text-[clamp(1.9rem,5.4vw,3rem)]"
              >
                Les bonnes affaires du moment
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm font-medium leading-relaxed text-[#3a2f12]">
                Des prix réduits sur une sélection de produits EcomDZ, tant qu’il y a du
                stock. Profitez-en avant tout le monde.
              </p>
              <Link
                href="/sneakers"
                className="btn mt-8 border border-[#1b1710] bg-[#1b1710] text-[#ffd15a]
                  hover:-translate-y-0.5 hover:bg-black"
              >
                Profiter des offres
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ================================================ pourquoi EcomDZ === */}
      <section className="container-page py-16 md:py-24" aria-labelledby="why-titre">
        <Reveal>
          <SectionHeader
            eyebrow="La promesse EcomDZ"
            title="Pourquoi choisir EcomDZ ?"
            description="Une boutique pensée pour rendre l’achat en ligne simple et rassurant, partout en Algérie."
          />
        </Reveal>
        <h2 id="why-titre" className="sr-only">
          Pourquoi choisir EcomDZ ?
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason, index) => (
            <Reveal key={reason.title} delay={index * 80}>
              <div className="surface flex h-full flex-col rounded-2xl p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent-2">
                  <reason.icon size={20} />
                </span>
                <h3 className="mt-4 font-display text-base font-bold">{reason.title}</h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-fg-2">
                  {reason.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
