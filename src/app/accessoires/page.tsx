import type { Metadata } from "next";
import { PageHeader } from "@/components/collection/PageHeader";
import { CollectionView } from "@/components/collection/CollectionView";
import { EmptyCategory } from "@/components/collection/EmptyCategory";
import { getByCategory, getCategory } from "@/lib/catalog";

const ACCESSORY_TYPES = [
  "Chaussettes",
  "Casquettes",
  "Sacs",
  "Ceintures",
  "Lacets",
  "Entretien",
];

export const metadata: Metadata = {
  title: "Accessoires",
  description:
    "Chaussettes, casquettes, sacs et produits d’entretien EcomDZ. Paiement à la livraison partout en Algérie.",
  alternates: { canonical: "/accessoires" },
};

export default function AccessoiresPage() {
  const products = getByCategory("accessoires");
  const category = getCategory("accessoires");

  return (
    <>
      <PageHeader
        eyebrow="Collection"
        title="Accessoires"
        description={category?.description}
        crumbs={[{ label: "Accessoires" }]}
        meta={
          products.length > 0
            ? `${products.length} article${products.length > 1 ? "s" : ""} en ligne`
            : undefined
        }
      />

      <div className="container-page py-8 md:py-10">
        {products.length > 0 ? (
          <CollectionView products={products} columns={4} />
        ) : (
          <EmptyCategory types={ACCESSORY_TYPES} label="Accessoires" />
        )}
      </div>
    </>
  );
}
