import type { Metadata } from "next";
import { PageHeader } from "@/components/collection/PageHeader";
import { CollectionView } from "@/components/collection/CollectionView";
import { getByCategory, getCategory } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Sneakers",
  description:
    "Toutes les sneakers STEP UP disponibles en Algérie. Stock réel, une paire par pointure, paiement à la livraison.",
  alternates: { canonical: "/sneakers" },
};

export default function SneakersPage() {
  const products = getByCategory("sneakers");
  const category = getCategory("sneakers");

  return (
    <>
      <PageHeader
        eyebrow="Collection"
        title="Sneakers"
        description={category?.description}
        crumbs={[{ label: "Sneakers" }]}
        meta={`${products.length} modèle${products.length > 1 ? "s" : ""} en ligne`}
      />

      <div className="container-page py-8 md:py-10">
        <CollectionView products={products} columns={4} />
      </div>
    </>
  );
}
