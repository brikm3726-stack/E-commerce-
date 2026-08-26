import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const POINTS = [
  {
    number: "01",
    title: "Sélection à l’unité",
    text: "Pas de commande en gros à l’aveugle : chaque paire est choisie, reçue puis vérifiée une par une avant d’être publiée.",
  },
  {
    number: "02",
    title: "Une paire par pointure",
    text: "Le stock affiché est le stock réel. Quand une pointure part, elle disparaît du site — vous ne commandez jamais dans le vide.",
  },
  {
    number: "03",
    title: "Vous payez à la réception",
    text: "Le livreur vous remet le colis, vous vérifiez, vous payez. Si la pointure ne va pas, l’échange se fait sous 48 h.",
  },
];

export function Editorial() {
  return (
    <section className="container-page py-16 md:py-24" aria-labelledby="methode-titre">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* ------------------------------------------------------- visuel */}
        <Reveal className="order-2 lg:order-1">
          <div className="surface relative aspect-4/5 overflow-hidden rounded-lg sm:aspect-3/2 lg:aspect-4/5">
            <Image
              src="/products/step-one-black-detail-1.webp"
              alt="Détail du contrefort et de la semelle surélevée de la sneaker McQUENNE"
              fill
              sizes="(max-width: 1024px) 92vw, 46vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent"
            />

            <div className="absolute inset-x-5 bottom-5">
              <p className="eyebrow mb-1.5 text-accent-2">Le modèle McQUENNE</p>
              <p className="font-display text-xl font-bold uppercase">
                Semelle surélevée 4 cm
              </p>
            </div>
          </div>
        </Reveal>

        {/* -------------------------------------------------------- texte */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="eyebrow mb-3 flex items-center gap-2.5">
              <span className="h-px w-6 bg-accent-line" aria-hidden="true" />
              Notre méthode
            </p>
            <h2 id="methode-titre" className="display text-[clamp(1.9rem,5.2vw,3rem)]">
              Peu de paires,
              <br />
              bien choisies
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-2">
              STEP UP n’est pas un catalogue infini. C’est une sélection courte, tenue à
              jour, où chaque référence est réellement disponible chez nous.
            </p>
          </Reveal>

          <ol className="mt-9 space-y-7">
            {POINTS.map((point, index) => (
              <Reveal key={point.number} delay={index * 100} as="li">
                <div className="flex gap-5">
                  <span
                    className="font-display text-sm font-bold text-accent-2 tabular-nums"
                    aria-hidden="true"
                  >
                    {point.number}
                  </span>
                  <div className="border-l border-line pl-5">
                    <h3 className="text-[0.9375rem] font-semibold text-fg">{point.title}</h3>
                    <p className="mt-1.5 max-w-md text-[0.8125rem] leading-relaxed text-fg-2">
                      {point.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={320}>
            <Link
              href="/a-propos"
              className="group mt-9 inline-flex items-center gap-2 text-[0.75rem]
                font-semibold tracking-[0.1em] uppercase text-accent-2"
            >
              En savoir plus sur la marque
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
