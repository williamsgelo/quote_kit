import type { Metadata } from "next";
import type { ReactNode } from "react";

import { NO_INDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Secure customer quote",
  robots: NO_INDEX_ROBOTS,
};

export default function PublicQuoteLayout({ children }: { children: ReactNode }) {
  return children;
}
