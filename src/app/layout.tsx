import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientWrapper from "./app-wrapper";
import { Toaster } from "@/shared/components/ui/sonner";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://zuno.io"),
  title: {
    default: "Zuno Marketplace - Buy, Sell & Create Digital Collectibles",
    template: "%s | Zuno Marketplace",
  },
  description:
    "Discover, collect, and sell extraordinary NFTs. The premier marketplace for digital art, gaming items, and collectibles across multiple blockchains.",
  keywords: [
    "NFT",
    "NFT marketplace",
    "digital art",
    "crypto art",
    "blockchain",
    "Ethereum",
    "Web3",
    "digital collectibles",
    "NFT trading",
    "mint NFT",
    "create NFT",
    "buy NFT",
    "sell NFT",
    "NFT auction",
    "crypto collectibles",
  ],
  authors: [{ name: "Zuno Team" }],
  creator: "Zuno Marketplace",
  publisher: "Zuno Marketplace",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Zuno Marketplace",
    title: "Zuno Marketplace - Buy, Sell & Create Digital Collectibles",
    description:
      "Discover, collect, and sell extraordinary NFTs. The premier marketplace for digital art, gaming items, and collectibles.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zuno Marketplace - Digital Collectibles Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zuno Marketplace - Buy, Sell & Create Digital Collectibles",
    description: "Discover, collect, and sell extraordinary NFTs on the premier Web3 marketplace.",
    images: ["/twitter-image.png"],
    creator: "@zunomarketplace",
    site: "@zunomarketplace",
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
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "vi-VN": "/vi-VN",
    },
  },
  verification: {
    google: "google-verification-code",
    yandex: "yandex-verification-code",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ClientWrapper>{children}</ClientWrapper>
        <Toaster />
      </body>
    </html>
  );
}
