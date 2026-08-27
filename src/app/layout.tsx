import type { Metadata, Viewport } from "next";
import { Archivo, Cairo, Inter } from "next/font/google";
import { StoreProvider } from "@/context/StoreProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SiteChrome } from "@/components/layout/SiteChrome";
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

/** Arabe : uniquement pour la page d'atterrissage /offre. */
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Boutique e-commerce moderne en Algérie`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "boutique en ligne Algérie",
    "e-commerce DZ",
    "achat en ligne Algérie",
    "produits tendance Alger",
    "paiement à la livraison",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Le shopping qui vous ressemble`,
    description: SITE.description,
    images: [
      {
        url: "/hero-ecomdz.webp",
        width: 1200,
        height: 1146,
        alt: "Produits EcomDZ dans un univers jaune",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Le shopping qui vous ressemble`,
    description: SITE.description,
    images: ["/hero-ecomdz.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#F5B301",
  colorScheme: "light",
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
    // `suppressHydrationWarning` : le script ci-dessous ajoute la classe « js »
    // sur <html> avant que React n'hydrate. Sans cette option, React signale
    // l'écart entre le HTML du serveur et celui du navigateur à chaque page.
    // `data-scroll-behavior` : requis par Next 15 quand html a scroll-behavior.
    <html
      lang="fr"
      className={`${inter.variable} ${archivo.variable} ${cairo.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
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
          <SiteChrome
            skipLink={
              <a
                href="#contenu"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4
                  focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2.5
                  focus:text-sm focus:font-semibold focus:text-[#1b1710]"
              >
                Aller au contenu
              </a>
            }
            header={
              <>
                <Navbar />
                <MobileMenu />
                <SearchOverlay />
                <CartDrawer />
              </>
            }
            footer={<Footer />}
          >
            {children}
          </SiteChrome>

          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
