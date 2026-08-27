import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/collection/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { CATEGORIES } from "@/data/products";
import { getAllProducts, getByCategory, getNewArrivals } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Toutes les collections STEP UP : sneakers, vêtements, accessoires et le dernier drop en date.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsPage() {
  const all = getAllProducts();
  const newest = getNewArrivals(1)[0];

  const collections = [
    {
      href: "/nouveautes",
      label: "New Drop",
      description:
        "Les dernières pièces reçues et contrôlées, mises en ligne au fil des arrivages.",
      image: newest?.cutout.src ?? "/products/step-one-black-cut.webp",
      count: `${all.length} pièces`,
      featured: true,
    },
    ...CATEGORIES.map((category) => {
      const count = getByCategory(category.slug).length;
      return {
        href: category.href,
        label: category.title,
        description: category.description,
        image: category.image,
        count: count > 0 ? `${count} modèle${count > 1 ? "s" : ""}` : null,
        featured: false,
      };
    }),
  ];

  return (
    <>
      <PageHeader
        eyebrow="Univers"
        title="Collections"
        description="Quatre entrées pour parcourir la boutique : le dernier drop, les sneakers, les vêtements et les accessoires."
        crumbs={[{ label: "Collections" }]}
      />

      <div className="container-page py-10 md:py-14">
        <div className="grid gap-4 md:grid-cols-2">
          {collections.map((collection, index) => (
            <Reveal
              key={collection.href}
              delay={index * 80}
              className={collection.featured ? "md:col-span-2" : ""}
            >
              <Link
                href={collection.href}
                className={`surface group relative flex overflow-hidden rounded-lg
                  transition-all duration-500 hover:border-line-strong
                  hover:shadow-[0_24px_70px_-30px_rgba(22,119,255,0.45)] ${
                    collection.featured
                      ? "min-h-[20rem] items-end md:min-h-[24rem]"
                      : "min-h-[17rem] items-end"
                  }`}
              >
                <div className="absolute inset-0">
                  <Image
                    src={collection.image}
                    alt=""
                    fill
                    sizes={collection.featured ? "92vw" : "(max-width: 768px) 92vw, 46vw"}
                    className="object-contain p-8 opacity-90 transition-transform
                      duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                      group-hover:scale-108"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent"
                  />
                </div>

                <div className="relative w-full p-7 md:p-9">
                  {collection.count && <span className="badge mb-3">{collection.count}</span>}
                  <h2
                    className={`display ${
                      collection.featured
                        ? "text-[clamp(2.2rem,6vw,3.4rem)]"
                        : "text-[clamp(1.7rem,4vw,2.2rem)]"
                    }`}
                  >
                    {collection.label}
                  </h2>
                  <p className="mt-2.5 max-w-md text-[0.8125rem] leading-relaxed text-fg-2">
                    {collection.description}
                  </p>
                  <span
                    className="mt-4 inline-flex items-center gap-2 text-[0.6875rem]
                      font-semibold tracking-[0.12em] uppercase text-accent-2"
                  >
                    Explorer
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-1.5"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
