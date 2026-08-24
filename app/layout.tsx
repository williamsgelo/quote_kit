import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "QuoteKit — Quotes that move business forward",
    template: "%s | QuoteKit",
  },
  description:
    "Create polished quotes, keep customers moving, and track every opportunity in one simple workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
