import type { ReactNode } from "react";

import { AppShell } from "@/components/app/app-shell";
import { requireOrganization } from "@/lib/auth/access";

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
