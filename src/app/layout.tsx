import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "GSAAN Products | Premium Puja Essentials",
    template: "%s | GSAAN Products",
  },
  description:
    "Premium quality camphor, agarbatti, sambrani & puja essentials. Trusted by temples and homes across Tamil Nadu since 1995. 100% pure products with fast delivery.",
  keywords: [
    "puja items",
    "camphor",
    "karpooram",
    "agarbatti",
    "incense sticks",
    "sambrani",
    "dhoop",
    "deepam oil",
    "pooja items",
    "temple supplies",
    "Salem",
    "Tamil Nadu",
    "wholesale puja items",
  ],
  authors: [{ name: "GSAAN Products" }],
  creator: "GSAAN Products",
  publisher: "GSAAN Products",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GSAAN Products | Premium Puja Essentials",
    description:
      "Premium quality camphor, agarbatti, sambrani & puja essentials. Trusted by temples and homes across Tamil Nadu since 1995.",
    url: "/",
    siteName: "GSAAN Products",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GSAAN Products | Premium Puja Essentials",
    description:
      "Premium quality camphor, agarbatti, sambrani & puja essentials.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#8B0000" />
      </head>
      <body className="min-h-screen bg-white font-body antialiased flex flex-col">
        <CartProvider>
          <ToastProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppFloat />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
