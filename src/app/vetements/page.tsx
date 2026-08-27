import type { Metadata } from "next";
import { PageHeader } from "@/components/collection/PageHeader";
import { CollectionView } from "@/components/collection/CollectionView";
import { EmptyCategory } from "@/components/collection/EmptyCategory";
import { CLOTHING_TYPES } from "@/data/products";
import { getByCategory, getCategory } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Vêtements",
  description:
    "T-shirts, hoodies, sweats, pantalons, vestes et ensembles streetwear EcomDZ. Livraison dans les 58 wilayas.",
  alternates: { canonical: "/vetements" },
};

export default function VetementsPage() {
  const products = getByCategory("vetements");
  const category = getCategory("vetements");

  return (
    <>
      <PageHeader
        eyebrow="Collection"
        title="Vêtements"
        description={category?.description}
        crumbs={[{ label: "Vêtements" }]}
        meta={
          products.length > 0
            ? `${products.length} pièce${products.length > 1 ? "s" : ""} en ligne`
            : undefined
        }
      />

      <div className="container-page py-8 md:py-10">
        {products.length > 0 ? (
          <CollectionView products={products} columns={4} />
        ) : (
          <EmptyCategory types={CLOTHING_TYPES} label="Vêtements" />
        )}
      </div>
    </>
  );
}
