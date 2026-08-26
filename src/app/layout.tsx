import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import { StoreProvider } from "@/context/StoreProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { Toaster } from "@/components/ui/Toaster";
import { SITE } from "@/data/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Sneakers & streetwear premium en Algérie`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "sneakers Algérie",
    "baskets homme Algérie",
    "streetwear DZ",
    "chaussures premium Alger",
    "paiement à la livraison",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Sneakers & streetwear premium`,
    description: SITE.description,
    images: [
      {
        url: "/products/step-one-navy-og.webp",
        width: 1200,
        height: 630,
        alt: "Sneaker McQUENNE par STEP UP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Sneakers & streetwear premium`,
    description: SITE.description,
    images: ["/products/step-one-navy-og.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#02040A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Fiche de l'entreprise pour les moteurs de recherche. */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  telephone: SITE.phone,
  email: SITE.email,
  currenciesAccepted: "DZD",
  paymentAccepted: "Paiement à la livraison",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Alger",
    addressCountry: "DZ",
  },
  areaServed: { "@type": "Country", name: "Algérie" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${archivo.variable}`}>
      <head>
        {/* Pose « js » sur <html> avant le premier rendu : les apparitions au
            defilement ne masquent le contenu que si le script tourne. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="min-h-dvh antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        <StoreProvider>
          <a
            href="#contenu"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4
              focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2.5
              focus:text-sm focus:font-semibold focus:text-white"
          >
            Aller au contenu
          </a>

          <Navbar />
          <MobileMenu />
          <SearchOverlay />
          <CartDrawer />

          <main id="contenu" className="pt-16 md:pt-18">
            {children}
          </main>

          <Footer />
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
