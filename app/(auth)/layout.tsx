import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CheckCircle2, FileCheck2, Sparkles } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { NO_INDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  robots: NO_INDEX_ROBOTS,
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-[0.9fr_1.1fr]">
      <div className="flex min-h-dvh flex-col bg-background px-4 py-5 sm:px-8">
        <Logo />
        <div className="mx-auto flex w-full max-w-md flex-1 items-center py-12">
          {children}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          © 2026 QuoteVia
        </p>
      </div>
      <aside className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="surface-grid absolute inset-0 opacity-10" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-blue-300">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Your quoting workspace
          </div>
          <h2 className="mt-8 max-w-lg text-4xl leading-tight font-semibold tracking-tight">
            Put every opportunity on a clearer path to yes.
          </h2>
          <p className="mt-4 max-w-lg leading-7 text-slate-400">
            Create professional quotes, keep customers organised, and see what
            needs your attention.
          </p>
        </div>
        <div className="relative">
          <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="flex size-9 items-center justify-center rounded-lg bg-blue-500">
                <FileCheck2 className="size-4.5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium">QK-1046 accepted</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Common Ground Studio · R 78,200
                </p>
              </div>
              <CheckCircle2
                className="ml-auto size-5 text-emerald-400"
                aria-hidden="true"
              />
            </div>
            <p className="pt-4 text-sm leading-6 text-slate-300">
              “QuoteVia gives us a calm, practical view of the work we’re about
              to win.”
            </p>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Sample workspace activity
          </p>
        </div>
      </aside>
    </main>
  );
}
