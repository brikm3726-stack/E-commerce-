import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/collection/PageHeader";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { HELP_TOPICS, getHelpTopic } from "@/data/help";
import { SITE } from "@/data/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Seuls les slugs connus au build existent : tout autre chemin renvoie un
 *  vrai 404 HTTP plutôt qu’une page 404 servie en 200. */
export const dynamicParams = false;

export function generateStaticParams() {
  return HELP_TOPICS.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getHelpTopic(slug);

  if (!topic) return { title: "Page introuvable" };

  return {
    title: topic.title,
    description: topic.description,
    alternates: { canonical: `/aide/${topic.slug}` },
  };
}

export default async function HelpPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = getHelpTopic(slug);

  if (!topic) notFound();

  const others = HELP_TOPICS.filter((t) => t.slug !== topic.slug);

  const faqSchema = topic.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: topic.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <PageHeader
        eyebrow={topic.eyebrow}
        title={topic.title}
        description={topic.description}
        crumbs={[{ label: "Aide" }, { label: topic.title }]}
      />

      <div className="container-page py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
          <div>
            {topic.sections.length > 0 && (
              <div className="space-y-10">
                {topic.sections.map((section, index) => (
                  <Reveal key={section.heading} delay={index * 70}>
                    <section>
                      <h2 className="font-display text-lg font-bold tracking-tight uppercase">
                        {section.heading}
                      </h2>

                      {section.paragraphs?.map((paragraph) => (
                        <p
                          key={paragraph.slice(0, 24)}
                          className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-fg-2"
                        >
                          {paragraph}
                        </p>
                      ))}

                      {section.bullets && (
                        <ul className="mt-4 space-y-2.5">
                          {section.bullets.map((bullet) => (
                            <li
                              key={bullet}
                              className="flex gap-3 text-[0.9375rem] leading-relaxed text-fg-2"
                            >
                              <span
                                className="mt-2 size-1 shrink-0 rounded-full bg-accent-2"
                                aria-hidden="true"
                              />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  </Reveal>
                ))}
              </div>
            )}

            {topic.faq && topic.faq.length > 0 && (
              <Reveal className="mt-12 block">
                <h2 className="mb-5 font-display text-lg font-bold tracking-tight uppercase">
                  Questions fréquentes
                </h2>
                <Accordion
                  defaultOpen={0}
                  items={topic.faq.map((item) => ({
                    title: item.question,
                    content: <p>{item.answer}</p>,
                  }))}
                />
              </Reveal>
            )}

            <Reveal className="mt-12 block">
              <div className="surface rounded-xl p-6 md:p-8">
                <h2 className="font-display text-base font-bold uppercase">
                  Vous n’avez pas trouvé votre réponse&nbsp;?
                </h2>
                <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-fg-2">
                  Écrivez-nous sur WhatsApp ou appelez-nous : nous répondons en général
                  en quelques minutes pendant les heures d’ouverture.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
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
            </Reveal>
          </div>

          {/* --------------------------------------------------- navigation */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="eyebrow mb-4">Autres sujets</p>
            <ul className="space-y-1.5">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/aide/${other.slug}`}
                    className="surface group flex items-center justify-between rounded-md
                      px-4 py-3 text-sm transition-all duration-300 hover:border-line-strong"
                  >
                    {other.title}
                    <ArrowRight
                      size={14}
                      className="text-fg-3 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </>
  );
}
