import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ToastProvider from "@/components/layout/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shopease-demo.web.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ShopEase — Shop Electronics, Fashion, Home & More Online",
    template: "%s | ShopEase",
  },
  description:
    "Discover quality products across electronics, fashion, home, beauty, and more. Fast shipping, secure checkout, and easy returns at ShopEase.",
  keywords: [
    "online shopping",
    "ecommerce",
    "electronics",
    "fashion",
    "home goods",
    "beauty products",
  ],
  authors: [{ name: "ShopEase" }],
  openGraph: {
    type: "website",
    siteName: "ShopEase",
    title: "ShopEase — Shop Electronics, Fashion, Home & More Online",
    description:
      "Discover quality products across electronics, fashion, home, beauty, and more.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopEase — Shop Online",
    description: "Discover quality products across electronics, fashion, home, beauty, and more.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ShopEase",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    sameAs: [
      "https://facebook.com",
      "https://instagram.com",
      "https://twitter.com",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ShopEase",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
