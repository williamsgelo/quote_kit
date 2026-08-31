import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppShell } from "@/components/app/app-shell";
import { requireOrganization } from "@/lib/auth/access";
import { NO_INDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  robots: NO_INDEX_ROBOTS,
};

export default async function ProtectedAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, organization, membership } = await requireOrganization();

  return (
    <AppShell
      user={user}
      organization={{ name: organization.name }}
      membershipRole={membership.role}
    >
      {children}
    </AppShell>
  );
}
