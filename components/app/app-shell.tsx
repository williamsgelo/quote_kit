"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  Boxes,
  FileText,
  LayoutDashboard,
  Menu,
  Plus,
  Settings,
  Users,
  X,
} from "lucide-react";

import { OrganisationSwitcher } from "@/components/app/organisation-switcher";
import { UserMenu } from "@/components/app/user-menu";
import { Logo } from "@/components/shared/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Catalog", href: "/catalog", icon: Boxes },
  { label: "Quotes", href: "/quotes", icon: FileText },
  { label: "Settings", href: "/settings", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-200">
      <div className="flex h-16 items-center border-b border-white/10 px-4">
        <Logo href="/dashboard" className="text-white" />
      </div>
      <div className="px-3 pt-4">
        <Link
          href="/quotes"
          onClick={onNavigate}
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-10 w-full justify-start bg-blue-600 px-3 text-white hover:bg-blue-500",
          )}
        >
          <Plus className="size-4" aria-hidden="true" />
          Create quote
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        <p className="px-2 pb-2 text-[10px] font-medium tracking-[0.14em] text-slate-500 uppercase">
          Workspace
        </p>
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-9 items-center gap-3 rounded-lg px-2.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-400",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-3 border-t border-white/10 p-3">
        <Link
          href="/catalog"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <BookOpen className="size-4" aria-hidden="true" />
          QuoteKit guide
        </Link>
        <OrganisationSwitcher inverted />
        <div className="rounded-lg bg-white p-0.5 text-slate-950">
          <UserMenu />
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-[min(82vw,18rem)] shadow-2xl">
            <button
              type="button"
              aria-label="Close navigation"
              className="absolute top-4 -right-12 flex size-9 items-center justify-center rounded-lg bg-white text-slate-900 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              onClick={() => setMobileOpen(false)}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              className="flex size-9 items-center justify-center rounded-lg border bg-background text-foreground shadow-xs hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-4" aria-hidden="true" />
            </button>
            <div className="hidden sm:block lg:hidden">
              <Logo compact href="/dashboard" />
            </div>
            <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              All systems operational
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Bell className="size-4" aria-hidden="true" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-blue-600 ring-2 ring-background" />
            </button>
            <UserMenu compact />
          </div>
        </header>
        <main className="mx-auto w-full max-w-400 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
