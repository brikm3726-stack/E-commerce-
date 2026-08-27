import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { withBasePath } from "@/lib/base-path";

/**
 * Hero EcomDZ — la maquette HD 16:9 fournie par le client, posée telle quelle.
 *
 * L'image porte son titre et sa description ; elle n'a ni barre de navigation
 * ni bouton. Le vrai header du site occupe le haut, et les boutons sont de
 * vrais liens HTML posés dans l'espace libre sous la description.
 *
 * Seule retouche du fichier : le logo « EcomDZ » peint en haut à gauche a été
 * effacé, le logo cliquable du header venant exactement à cette place.
 * L'image n'est ni rognée ni déformée.
 *
 * Sous `lg`, le texte peint devient illisible : on cadre alors le visuel sur
 * le téléphone (fichier dédié, sans texte) et le titre repasse en vrai HTML.
 */

/** Le texte peint commence à 52 px du bord sur une image de 1672 px de large.
 *  Les boutons s'alignent dessus, et se placent sous la description. */
const OVERLAY = { left: "3.11%", top: "68.5%" };

const PERKS = [
  { icon: Truck, label: "Livraison rapide" },
  { icon: ShieldCheck, label: "Paiement sécurisé" },
  { icon: Sparkles, label: "Produits sélectionnés" },
];

const ALT =
  "EcomDZ — un smartphone entouré de produits tendance : sneakers, lunettes, " +
  "chemise et accessoires dans un univers jaune";

export function Hero() {
  return (
    <section className="relative -mt-16 md:-mt-18" aria-label="Bienvenue chez EcomDZ">
      {/* ============================== grand écran : la maquette, entière */}
      <div className="relative hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withBasePath("/hero-ecomdz.webp")}
          alt={ALT}
          width={1672}
          height={941}
          fetchPriority="high"
          decoding="async"
          className="block w-full"
        />

        {/* Boutons et réassurances : tailles en `vw` pour suivre l'image, qui
            occupe toute la largeur de la fenêtre. */}
        <div className="absolute" style={OVERLAY}>
          <div className="flex items-center gap-[1.1vw]">
            <Link
              href="/collections"
              className="inline-flex h-[3.1vw] items-center gap-[0.7vw] rounded-full
                bg-accent px-[1.9vw] text-[0.96vw] font-bold text-[#1b1710]
                shadow-[0_1vw_2.4vw_-0.8vw_rgba(26,20,6,0.55)] transition-all
                duration-300 hover:-translate-y-0.5 hover:bg-[#ffc838]"
            >
              Découvrir la boutique
              <ArrowRight className="size-[1.05vw]" />
            </Link>

            <Link
              href="/sneakers"
              className="inline-flex h-[3.1vw] items-center rounded-full border
                border-white/45 px-[1.9vw] text-[0.96vw] font-bold text-white
                transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15"
            >
              Voir la boutique
            </Link>
          </div>

          <ul className="mt-[1.5vw] flex items-center gap-[2.1vw] text-[0.8vw] text-white/85">
            {PERKS.map((perk) => (
              <li key={perk.label} className="flex items-center gap-[0.5vw]">
                <perk.icon className="size-[1vw]" />
                {perk.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ============================ petit écran : visuel cadré + vrai texte */}
      <div className="lg:hidden">
        <div className="relative aspect-[832/941] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBasePath("/hero-ecomdz-mobile.webp")}
            alt={ALT}
            width={832}
            height={941}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
          {/* voile discret : garde le header blanc lisible par-dessus le visuel */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent"
          />
        </div>

        <div
          className="px-5 pt-8 pb-12 text-center text-[#1b1710]"
          style={{ background: "linear-gradient(180deg, #f0ab00 0%, #ffc93c 100%)" }}
        >
          <span
            className="inline-flex items-center rounded-full border border-[#1b1710]/15
              bg-white/55 px-3.5 py-1.5 text-[0.625rem] font-bold tracking-[0.18em] uppercase"
          >
            Bienvenue chez EcomDZ
          </span>

          <h1 className="display mt-4 text-[clamp(2rem,8.5vw,3rem)]">
            Le meilleur du
            <br />
            <span className="text-white">shopping en ligne.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-[0.9375rem] font-medium leading-relaxed text-[#3d3212]">
            Découvrez des produits tendance, de qualité et au meilleur prix.
            Livraison rapide en Algérie.
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <Link
              href="/collections"
              className="btn border border-[#1b1710] bg-[#1b1710] text-[#ffd964]
                shadow-[0_12px_30px_-10px_rgba(26,20,6,0.5)]"
            >
              Découvrir la boutique
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/sneakers"
              className="btn border border-[#1b1710]/25 bg-white text-[#1b1710]"
            >
              Voir la boutique
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-medium text-[#3d3212]">
            {PERKS.map((perk) => (
              <li key={perk.label} className="flex items-center gap-2">
                <perk.icon size={15} />
                {perk.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
