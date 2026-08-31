import type { Metadata } from "next";

import {
  GoogleTagManagerHead,
  GoogleTagManagerNoScript,
} from "@/components/analytics/google-tag-manager";
import {
  HOMEPAGE_DESCRIPTION,
  HOMEPAGE_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: {
    default: HOMEPAGE_TITLE,
    template: "%s | QuoteKit",
  },
  description: HOMEPAGE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: SITE_NAME,
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "QuoteKit online quotation software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA" className="h-full antialiased">
      <head>
        <GoogleTagManagerHead />
      </head>
      <body className="flex min-h-full flex-col">
        <GoogleTagManagerNoScript />
        {children}
      </body>
    </html>
  );
}
