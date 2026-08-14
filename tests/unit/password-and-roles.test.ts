import assert from "node:assert/strict";
import test from "node:test";

import { MembershipRole } from "../../generated/prisma/client";
import { hashPassword, verifyPassword } from "../../lib/auth/password";
import { isOrganizationRoleAllowed } from "../../lib/auth/roles";

test("passwords use asynchronous bcrypt hashing with cost 12", async () => {
  const password = "unit-test-password";
  const passwordHash = await hashPassword(password);

  assert.notEqual(passwordHash, password);
  assert.match(passwordHash, /^\$2[aby]\$12\$/);
  assert.equal(await verifyPassword(password, passwordHash), true);
  assert.equal(await verifyPassword("incorrect-password", passwordHash), false);
});

test("organisation roles are matched against an explicit allow-list", () => {
  assert.equal(
    isOrganizationRoleAllowed(MembershipRole.OWNER, [MembershipRole.OWNER]),
    true,
  );
  assert.equal(
    isOrganizationRoleAllowed(MembershipRole.ADMIN, [
      MembershipRole.OWNER,
      MembershipRole.ADMIN,
    ]),
    true,
  );
  assert.equal(
    isOrganizationRoleAllowed(MembershipRole.MEMBER, [MembershipRole.OWNER]),
    false,
  );
});
