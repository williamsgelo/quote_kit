import { MembershipRole } from "@/generated/prisma/client";

export function isOrganizationRoleAllowed(
  currentRole: MembershipRole,
  allowedRoles: readonly MembershipRole[],
) {
  return allowedRoles.includes(currentRole);
}
