import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/collection/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { getAllProducts, totalStock } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "STEP UP, boutique algérienne de sneakers et streetwear : une sélection courte, un stock réel, un paiement à la livraison.",
  alternates: { canonical: "/a-propos" },
};

export default function AboutPage() {
  const products = getAllProducts();
  const pairs = products.reduce((sum, product) => sum + totalStock(product), 0);

  return (
    <>
      <PageHeader
        eyebrow="La marque"
        title="À propos"
        description="STEP UP est né d’un constat simple : en Algérie, acheter une paire en ligne relève trop souvent du pari."
        crumbs={[{ label: "À propos" }]}
      />

      <div className="container-page py-12 md:py-16">
        {/* --------------------------------------------------------- récit */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="surface relative aspect-4/5 overflow-hidden rounded-xl">
              <Image
                src="/products/step-one-navy-detail-2.webp"
                alt="Détail du laçage et de la semelle de la sneaker McQUENNE"
                fill
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"
              />
            </div>
          </Reveal>

          <div className="space-y-5">
            <Reveal>
              <h2 className="display text-[clamp(1.8rem,5vw,2.8rem)]">
                Le stock affiché
                <br />
                est le stock réel
              </h2>
            </Reveal>

            <Reveal delay={80}>
              <p className="text-[0.9375rem] leading-relaxed text-fg-2">
                Beaucoup de boutiques en ligne affichent des catalogues immenses sans
                jamais avoir la marchandise. Vous commandez, on vous rappelle deux jours
                plus tard pour dire que votre pointure n’est finalement pas disponible.
              </p>
            </Reveal>

            <Reveal delay={140}>
              <p className="text-[0.9375rem] leading-relaxed text-fg-2">
                Nous faisons l’inverse. Nous achetons peu, nous recevons la marchandise,
                nous la contrôlons, puis nous la mettons en ligne — pointure par pointure.
                Quand une paire part, elle disparaît du site le jour même.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-[0.9375rem] leading-relaxed text-fg-2">
                C’est une contrainte : notre catalogue reste court. C’est aussi une
                garantie : ce que vous voyez existe vraiment, et vous ne payez qu’une fois
                le colis entre vos mains.
              </p>
            </Reveal>

            {/* chiffres */}
            <Reveal delay={260}>
              <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-8">
                {[
                  { value: String(products.length), label: "Modèles en ligne" },
                  { value: String(pairs), label: "Paires en stock" },
                  { value: "58", label: "Wilayas livrées" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="font-display text-3xl font-bold text-accent-2">
                        {stat.value}
                      </span>
                      <span className="mt-1 block text-xs text-fg-3">{stat.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>

        {/* ------------------------------------------------------ engagements */}
        <section className="mt-20" aria-labelledby="engagements-titre">
          <Reveal>
            <h2 id="engagements-titre" className="display text-[clamp(1.7rem,4.6vw,2.4rem)]">
              Nos engagements
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Aucune photo trompeuse",
                text: "Les visuels du site sont ceux des paires que nous avons réellement en main. Pas de rendu 3D, pas d’image empruntée à une autre marque.",
              },
              {
                number: "02",
                title: "Un appel avant expédition",
                text: "Nous confirmons chaque commande par téléphone : pointure, adresse, disponibilité. Cela évite les colis retournés et les mauvaises surprises.",
              },
              {
                number: "03",
                title: "Vous payez à la réception",
                text: "Aucun paiement en ligne, aucune avance. Le livreur vous remet le colis, vous vérifiez, vous réglez en espèces.",
              },
            ].map((item, index) => (
              <Reveal key={item.number} delay={index * 90}>
                <article className="surface h-full rounded-xl p-6">
                  <span className="font-display text-sm font-bold text-accent-2">
                    {item.number}
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold uppercase">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-fg-2">
                    {item.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ CTA */}
        <Reveal className="mt-14 block">
          <div className="surface flex flex-col items-center gap-5 rounded-xl px-6 py-12 text-center md:px-12">
            <h2 className="display text-[clamp(1.6rem,4.4vw,2.2rem)]">
              Voir ce qui est disponible aujourd’hui
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-fg-2">
              Le catalogue est mis à jour à chaque vente et à chaque arrivage.
            </p>
            <Link href="/sneakers" className="btn btn-primary">
              Voir la collection
              <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>
      </div>
    </>
  );
}
