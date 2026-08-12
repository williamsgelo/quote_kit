import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getActiveOrganizationMembership } from "@/lib/auth/organization";

export async function requireUser(callbackUrl = "/dashboard") {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return session.user;
}

export async function requireOrganization() {
  const user = await requireUser();
  const membership = await getActiveOrganizationMembership(user.id);

  if (!membership) {
    redirect("/onboarding");
  }

  return {
    user,
    membership: {
      id: membership.id,
      role: membership.role,
      createdAt: membership.createdAt,
    },
    organization: membership.organization,
  };
}
