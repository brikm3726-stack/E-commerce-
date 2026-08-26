import type { Metadata } from "next";
import { PageHeader } from "@/components/collection/PageHeader";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Commande",
  description:
    "Finalisez votre commande STEP UP : livraison dans les 58 wilayas, paiement à la livraison.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/commande" },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Étape finale"
        title="Commande"
        description="Trois informations suffisent : qui vous êtes, où livrer, comment payer. Nous vous appelons ensuite pour confirmer."
        crumbs={[{ label: "Panier", href: "/panier" }, { label: "Commande" }]}
      />

      <div className="container-page py-10 md:py-14">
        <CheckoutForm />
      </div>
    </>
  );
}
