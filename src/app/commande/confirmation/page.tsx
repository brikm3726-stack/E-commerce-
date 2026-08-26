import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";

export const metadata: Metadata = {
  title: "Commande confirmée",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <div className="container-page py-12 md:py-20">
      <OrderConfirmation />
    </div>
  );
}
