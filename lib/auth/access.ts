import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { MembershipRole } from "@/generated/prisma/client";
import {
  getActiveOrganizationMembership,
  getOrganizationMembership,
} from "@/lib/auth/organization";
import { isOrganizationRoleAllowed } from "@/lib/auth/roles";
import { prisma } from "@/lib/prisma";
import { retryTransientDatabaseRead } from "@/lib/prisma-retry";

type AccessBehavior = "redirect" | "throw";

type RequireUserOptions = {
  behavior?: AccessBehavior;
  callbackUrl?: string;
};

type RequireOrganizationOptions = RequireUserOptions;

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
} as const;

export class AuthenticationRequiredError extends Error {
  constructor() {
    super("Authentication is required.");
    this.name = "AuthenticationRequiredError";
  }
}

export class OrganizationRequiredError extends Error {
  constructor() {
    super("An active organisation membership is required.");
    this.name = "OrganizationRequiredError";
  }
}

export class OrganizationAccessDeniedError extends Error {
  constructor() {
    super("You do not have access to this organisation.");
    this.name = "OrganizationAccessDeniedError";
  }
}

export class OrganizationRoleRequiredError extends Error {
  constructor() {
    super("Your organisation role does not permit this operation.");
    this.name = "OrganizationRoleRequiredError";
  }
}

function loginPath(callbackUrl?: string) {
  return callbackUrl
    ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/login";
}

export async function getAuthenticatedUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return retryTransientDatabaseRead(() =>
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: safeUserSelect,
    }),
  );
}

export async function requireUser(options: RequireUserOptions = {}) {
  const user = await getAuthenticatedUser();

  if (user) {
    return user;
  }

  if (options.behavior === "throw") {
    throw new AuthenticationRequiredError();
  }

  redirect(loginPath(options.callbackUrl));
}

export async function requireOrganization(
  options: RequireOrganizationOptions = {},
) {
  const user = await requireUser(options);
  const membership = await getActiveOrganizationMembership(user.id);

  if (!membership) {
    if (options.behavior === "throw") {
      throw new OrganizationRequiredError();
    }

    redirect("/onboarding");
  }

  return {
    user,
    membership: {
      id: membership.id,
      role: membership.role,
    },
    organization: membership.organization,
  };
}

export async function requireOrganizationRole(
  allowedRoles: readonly MembershipRole[],
  options: RequireOrganizationOptions = {},
) {
  const context = await requireOrganization(options);

  if (!isOrganizationRoleAllowed(context.membership.role, allowedRoles)) {
    throw new OrganizationRoleRequiredError();
  }

  return context;
}

export async function assertOrganizationAccess(requestedOrganizationId: string) {
  const user = await requireUser({ behavior: "throw" });
  const membership = await getOrganizationMembership(
    user.id,
    requestedOrganizationId,
  );

  if (!membership) {
    throw new OrganizationAccessDeniedError();
  }

  return {
    user,
    membership: {
      id: membership.id,
      role: membership.role,
    },
    organization: membership.organization,
  };
}

export async function getAuthenticatedAppPath() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const membership = await getActiveOrganizationMembership(user.id);

  return membership ? "/dashboard" : "/onboarding";
}
