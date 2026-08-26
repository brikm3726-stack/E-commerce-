import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHeader } from "@/components/collection/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez STEP UP : WhatsApp, téléphone ou e-mail. Réponse rapide pendant les heures d’ouverture.",
  alternates: { canonical: "/contact" },
};

const CHANNELS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Le plus rapide",
    detail: "Disponibilité, pointures, suivi de commande",
    href: `https://wa.me/${SITE.whatsapp}`,
    external: true,
    primary: true,
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: SITE.phone,
    detail: "Du samedi au jeudi, 9 h – 18 h",
    href: `tel:${SITE.phone.replace(/\s/g, "")}`,
    external: false,
    primary: false,
  },
  {
    icon: Mail,
    label: "E-mail",
    value: SITE.email,
    detail: "Réponse sous 24 h ouvrées",
    href: `mailto:${SITE.email}`,
    external: false,
    primary: false,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Nous joindre"
        title="Contact"
        description="Une question sur une pointure, un délai ou un échange ? Écrivez-nous, nous répondons vite."
        crumbs={[{ label: "Contact" }]}
      />

      <div className="container-page py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {CHANNELS.map((channel, index) => (
            <Reveal key={channel.label} delay={index * 80}>
              <a
                href={channel.href}
                target={channel.external ? "_blank" : undefined}
                rel={channel.external ? "noopener noreferrer" : undefined}
                className={`surface group flex h-full flex-col rounded-xl p-6
                  transition-all duration-400 hover:border-line-strong ${
                    channel.primary ? "border-accent-line" : ""
                  }`}
              >
                <channel.icon
                  size={20}
                  className={channel.primary ? "text-accent-2" : "text-fg-2"}
                />
                <p className="eyebrow mt-5 mb-1.5">{channel.label}</p>
                <p className="font-display text-lg font-bold">{channel.value}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-fg-3">{channel.detail}</p>

                <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.1em] uppercase text-fg-2 transition-colors group-hover:text-accent-2">
                  Ouvrir
                  <ArrowRight
                    size={12}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        {/* -------------------------------------------------- informations */}
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Reveal>
            <div className="surface h-full rounded-xl p-6 md:p-7">
              <h2 className="font-display text-base font-bold uppercase">Informations</h2>

              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-accent-2" />
                  <div>
                    <p className="text-fg">{SITE.city}</p>
                    <p className="text-xs text-fg-3">
                      Vente en ligne uniquement, pas de boutique physique pour l’instant.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Clock size={16} className="mt-0.5 shrink-0 text-accent-2" />
                  <div>
                    <p className="text-fg">Samedi – jeudi, 9 h à 18 h</p>
                    <p className="text-xs text-fg-3">Fermé le vendredi.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Instagram size={16} className="mt-0.5 shrink-0 text-accent-2" />
                  <div>
                    <a
                      href={SITE.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-fg"
                    >
                      Suivre la boutique sur Instagram
                    </a>
                    <p className="text-xs text-fg-3">Nouveaux arrivages en story.</p>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="surface h-full rounded-xl p-6 md:p-7">
              <h2 className="font-display text-base font-bold uppercase">
                Avant de nous écrire
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-2">
                La réponse à votre question s’y trouve peut-être déjà :
              </p>

              <ul className="mt-5 space-y-1.5">
                {[
                  { label: "Délais et tarifs de livraison", href: "/aide/livraison" },
                  { label: "Retours et échanges", href: "/aide/retours" },
                  { label: "Guide des tailles", href: "/aide/guide-des-tailles" },
                  { label: "Questions fréquentes", href: "/aide/faq" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center justify-between rounded-md
                        border border-line px-4 py-3 text-sm transition-all duration-300
                        hover:border-line-strong"
                    >
                      {link.label}
                      <ArrowRight
                        size={14}
                        className="text-fg-3 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
