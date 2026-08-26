import type { Metadata } from "next";
import { PageHeader } from "@/components/collection/PageHeader";
import { WishlistContent } from "@/components/product/WishlistContent";

export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Retrouvez les pièces STEP UP que vous avez sauvegardées.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/favoris" },
};

export default function WishlistPage() {
  return (
    <>
      <PageHeader
        eyebrow="Votre sélection"
        title="Mes favoris"
        description="Vos pièces sauvegardées, conservées sur cet appareil."
        crumbs={[{ label: "Favoris" }]}
      />

      <div className="container-page py-10 md:py-14">
        <WishlistContent />
      </div>
    </>
  );
}
