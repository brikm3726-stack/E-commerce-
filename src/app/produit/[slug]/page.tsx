import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, CreditCard, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { PromoCountdown } from "@/components/product/PromoCountdown";
import { ProductGrid } from "@/components/product/ProductGrid";
import { PROMO_ENDS_AT } from "@/data/products";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { ProductBadge } from "@/components/ui/ProductBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { getAllProducts, getProduct, getRelated, totalStock } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { SHIPPING, SITE } from "@/data/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Seuls les slugs connus au build existent : tout autre chemin renvoie un
 *  vrai 404 HTTP plutôt qu’une page 404 servie en 200. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return { title: "Produit introuvable" };
  }

  const title = `${product.name} ${product.colorName}`;
  const description = `${product.subtitle} à ${formatPrice(product.price)}. ${product.description.slice(0, 110)}…`;

  return {
    title,
    description,
    alternates: { canonical: `/produit/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${title} — ${SITE.name}`,
      description,
      url: `${SITE.url}/produit/${product.slug}`,
      images: [{ url: `/products/${product.slug}-og.webp`, width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  const stock = totalStock(product);
  const related = getRelated(product);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} ${product.colorName}`,
    description: product.description,
    sku: product.id,
    brand: { "@type": "Brand", name: product.brand },
    image: product.images.map((image) => `${SITE.url}${image.src}`),
    color: product.colorName,
    material: product.materials,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/produit/${product.slug}`,
      priceCurrency: "DZD",
      price: product.price,
      availability:
        stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE.name },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Sneakers", item: `${SITE.url}/sneakers` },
      {
        "@type": "ListItem",
        position: 3,
        name: `${product.name} ${product.colorName}`,
        item: `${SITE.url}/produit/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container-page pt-6 pb-16 md:pb-24">
        {/* --------------------------------------------------- fil d'Ariane */}
        <nav aria-label="Fil d’Ariane" className="mb-7">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-fg-3">
            <li>
              <Link href="/" className="transition-colors hover:text-fg">
                Accueil
              </Link>
            </li>
            <ChevronRight size={12} aria-hidden="true" />
            <li>
              <Link href="/sneakers" className="transition-colors hover:text-fg">
                Sneakers
              </Link>
            </li>
            <ChevronRight size={12} aria-hidden="true" />
            <li aria-current="page" className="text-fg-2">
              {product.name} {product.colorName}
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-14">
          {/* ------------------------------------------------------ galerie */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* -------------------------------------------------------- achat */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {product.badge && <ProductBadge kind={product.badge} />}
              {stock > 0 && stock <= 3 && (
                <span className="badge badge-danger">
                  {stock === 1 ? "Dernière paire" : `Plus que ${stock} paires`}
                </span>
              )}
              {stock === 0 && <span className="badge">Épuisé</span>}
            </div>

            <h1 className="display text-[clamp(2rem,6vw,2.75rem)]">{product.name}</h1>
            <p className="mt-2 text-sm text-fg-2">{product.subtitle}</p>

            <div className="mt-4">
              <Price value={product.price} oldValue={product.oldPrice} size="lg" />
            </div>

            <div className="mt-3">
              <Rating value={product.rating} reviews={product.reviews} size="md" />
            </div>

            <PromoCountdown endsAt={PROMO_ENDS_AT} className="mt-4" />

            <p className="mt-5 text-[0.875rem] leading-relaxed text-fg-2">
              {product.description}
            </p>

            <div className="my-7 rule" />

            <ProductPurchase product={product} />

            {/* ------------------------------------------------ réassurance */}
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                {
                  icon: Truck,
                  title: "Livraison 48–72 h",
                  detail: `${formatPrice(SHIPPING.domicile)} à domicile · offerte dès ${formatPrice(SHIPPING.freeFrom)}`,
                },
                {
                  icon: CreditCard,
                  title: "Paiement à la livraison",
                  detail: "Vous payez à la réception du colis",
                },
                {
                  icon: RotateCcw,
                  title: "Échange sous 48 h",
                  detail: "Si la pointure ne convient pas",
                },
                {
                  icon: ShieldCheck,
                  title: "Paire vérifiée",
                  detail: "Contrôlée avant expédition",
                },
              ].map((item) => (
                <li key={item.title} className="surface-2 flex gap-3 rounded-md p-3.5">
                  <item.icon size={17} className="mt-0.5 shrink-0 text-accent-2" />
                  <div>
                    <p className="text-[0.8125rem] font-semibold text-fg">{item.title}</p>
                    <p className="text-xs leading-relaxed text-fg-3">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* ---------------------------------------------------- détails */}
            <Accordion
              className="mt-8"
              items={[
                {
                  title: "Détails du produit",
                  content: (
                    <ul className="space-y-2">
                      {product.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-2.5">
                          <span
                            className="mt-1.5 size-1 shrink-0 rounded-full bg-accent-2"
                            aria-hidden="true"
                          />
                          {highlight}
                        </li>
                      ))}
                      <li className="flex gap-2.5">
                        <span
                          className="mt-1.5 size-1 shrink-0 rounded-full bg-accent-2"
                          aria-hidden="true"
                        />
                        {product.materials}
                      </li>
                      <li className="flex gap-2.5">
                        <span
                          className="mt-1.5 size-1 shrink-0 rounded-full bg-accent-2"
                          aria-hidden="true"
                        />
                        Référence {product.id}
                      </li>
                    </ul>
                  ),
                },
                {
                  title: "Livraison & délais",
                  content: (
                    <div className="space-y-2">
                      <p>
                        Expédition sous 24 h ouvrées après confirmation de la commande par
                        téléphone. Livraison en 48 à 72 h selon la wilaya.
                      </p>
                      <p>
                        À domicile : {formatPrice(SHIPPING.domicile)} · Au bureau du
                        transporteur : {formatPrice(SHIPPING.bureau)}. Livraison offerte à
                        partir de {formatPrice(SHIPPING.freeFrom)} d’achat.
                      </p>
                    </div>
                  ),
                },
                {
                  title: "Retours & échanges",
                  content: (
                    <p>
                      Si la pointure ne convient pas, contactez-nous dans les 48 h suivant
                      la réception. L’échange se fait dans la limite du stock disponible,
                      la paire devant être non portée et dans son emballage d’origine.
                    </p>
                  ),
                },
                {
                  title: "Paiement",
                  content: (
                    <p>
                      Paiement à la livraison, en espèces, au moment de la réception. Le
                      paiement par carte CIB et Edahabia sera ajouté prochainement.
                    </p>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* --------------------------------------------------- autres coloris */}
      {related.length > 0 && (
        <section className="container-page pb-16 md:pb-24" aria-labelledby="lies-titre">
          <Reveal>
            <SectionHeader
              eyebrow="Le même modèle"
              title="Autres coloris"
              description="La même silhouette, décliné en trois finitions."
            />
          </Reveal>
          <h2 id="lies-titre" className="sr-only">
            Autres coloris
          </h2>
          <ProductGrid products={related} className="mt-10" priorityCount={0} />
        </section>
      )}
    </>
  );
}
