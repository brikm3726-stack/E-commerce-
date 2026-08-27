import type { Metadata } from "next";
import { PageHeader } from "@/components/collection/PageHeader";
import { CartContent } from "@/components/cart/CartContent";

export const metadata: Metadata = {
  title: "Panier",
  description: "Votre panier EcomDZ : vérifiez vos articles avant de passer commande.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/panier" },
};

export default function CartPage() {
  return (
    <>
      <PageHeader eyebrow="Commande" title="Panier" crumbs={[{ label: "Panier" }]} />

      <div className="container-page py-10 md:py-14">
        <CartContent />
      </div>
    </>
  );
}
