import type { Metadata } from "next";
import { PageHeader } from "@/components/collection/PageHeader";
import { AccountContent } from "@/components/account/AccountContent";

export const metadata: Metadata = {
  title: "Mon compte",
  description: "Suivi de commande, favoris et panier STEP UP.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/compte" },
};

export default function AccountPage() {
  return (
    <>
      <PageHeader
        eyebrow="Espace client"
        title="Mon compte"
        description="Retrouvez votre dernière commande, vos favoris et votre panier. Aucune inscription nécessaire."
        crumbs={[{ label: "Mon compte" }]}
      />

      <div className="container-page py-10 md:py-14">
        <AccountContent />
      </div>
    </>
  );
}
