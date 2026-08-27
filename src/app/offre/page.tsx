import type { Metadata } from "next";
import { OrderLanding } from "@/components/landing/OrderLanding";
import { getByCategory } from "@/lib/catalog";
import { SITE } from "@/data/site";

/**
 * Page d'atterrissage des campagnes Facebook Ads (Algérie), en arabe.
 *
 * Elle vit à part du reste du site : ni en-tête, ni pied de page, ni menu —
 * voir `SiteChrome`. Une seule action possible : commander.
 */
export const metadata: Metadata = {
  title: "اطلب صباط McQUENNE — الدفع عند الاستلام",
  description:
    "صباط McQUENNE بـ 1800 دج بدل 3900 دج. الدفع عند الاستلام، التوصيل لـ 58 ولاية. اطلب الآن في أقل من دقيقة.",
  alternates: { canonical: "/offre" },
  openGraph: {
    type: "website",
    locale: "ar_DZ",
    siteName: SITE.name,
    title: "صباط McQUENNE بـ 1800 دج — الدفع عند الاستلام",
    description:
      "عرض محدود. التوصيل لكل ولايات الوطن، و ما تخلّص حتى توصلك الطلبية.",
    images: [{ url: "/products/step-one-navy-og.webp", width: 1200, height: 630 }],
  },
  // la page double le catalogue français : on la garde hors de l'index pour
  // ne pas se concurrencer soi-même. Les publicités y amènent directement.
  robots: { index: false, follow: true },
};

export default function OffrePage() {
  const products = getByCategory("sneakers");
  return <OrderLanding products={products} />;
}
