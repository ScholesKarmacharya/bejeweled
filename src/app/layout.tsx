import type { Metadata } from "next";

import "./globals.css";

import SiteChrome from "@/components/SiteChrome";
import { CartProvider } from "@/context/CartContext";
import BackToTop from "@/components/BackToTop";

/* =========================================================
   SITE METADATA
========================================================= */

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000"
  ),

  title: {
    default:
      "Bejeweled | Brass & Gold Plated Jewelry",
    template:
      "%s | Bejeweled",
  },

  description:
    "Discover original brass and gold plated jewelry from Bejeweled. Shop necklaces, rings, earrings, bangles, watches and elegant pieces selected for everyday style and special occasions.",

  keywords: [
    "Bejeweled",
    "jewelry Nepal",
    "gold plated jewelry",
    "brass jewelry",
    "jewelry Butwal",
    "necklaces Nepal",
    "rings Nepal",
    "earrings Nepal",
    "bangles Nepal",
    "watches Nepal",
    "fashion jewelry Nepal",
  ],

  authors: [
    {
      name: "Bejeweled",
    },
  ],

  creator:
    "Bejeweled",

  publisher:
    "Bejeweled",

  applicationName:
    "Bejeweled",

  category:
    "Jewelry",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: "website",

    locale: "en_US",

    siteName:
      "Bejeweled",

    title:
      "Bejeweled | Brass & Gold Plated Jewelry",

    description:
      "Discover elegant brass and gold plated jewelry selected for everyday style, celebrations, and meaningful moments.",

    images: [
      {
        url:
          "favicon.ico",

        width: 1200,
        height: 630,

        alt:
          "Bejeweled brass and gold plated jewelry",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Bejeweled | Brass & Gold Plated Jewelry",

    description:
      "Discover elegant brass and gold plated jewelry selected for everyday style and special occasions.",

    images: [
      "/twitter-image.jpg",
    ],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,

      "max-image-preview":
        "large",

      "max-snippet":
        -1,

      "max-video-preview":
        -1,
    },
  },

  icons: {
   

    apple:
      "/apple-icon.png",
  },
};

/* =========================================================
   ROOT LAYOUT
========================================================= */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body>

        <CartProvider>

          <SiteChrome>
            {children}
          </SiteChrome>

        </CartProvider>
    <BackToTop />

      </body>

    </html>
  );
}