import "dotenv/config";

import assert from "node:assert/strict";
import { after, test } from "node:test";

import { MembershipRole } from "../../generated/prisma/client";
import { authenticateCredentials } from "../../lib/auth/credentials";
import { getOrganizationMembership } from "../../lib/auth/organization";
import { createCredentialsUser } from "../../lib/auth/registration";
import { prisma } from "../../lib/prisma";
import { createFirstOrganizationForUser } from "../../lib/organizations/onboarding";

const marker = `auth-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const email = `${marker}@example.test`;
const password = "integration-test-password";
const createdOrganizationIds: string[] = [];
let userId: string | undefined;

after(async () => {
  if (userId) {
    await prisma.user.deleteMany({ where: { id: userId } });
  }
  if (createdOrganizationIds.length) {
    await prisma.organization.deleteMany({
      where: { id: { in: createdOrganizationIds } },
    });
  }
  await prisma.$disconnect();
});

test("registration stores a bcrypt hash and rejects duplicate email", async () => {
  const created = await createCredentialsUser({
    name: "Integration User",
    email,
    password,
  });

  assert.equal(created.status, "created");
  assert.ok("userId" in created);
  userId = created.userId;

  const storedUser = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { passwordHash: true },
  });
  assert.notEqual(storedUser.passwordHash, password);
  assert.match(storedUser.passwordHash ?? "", /^\$2[aby]\$12\$/);

  const duplicate = await createCredentialsUser({
    name: "Duplicate User",
    email: email.toUpperCase(),
    password,
  });
  assert.equal(duplicate.status, "duplicate");
});

test("credential verification accepts the correct password only", async () => {
  const authenticated = await authenticateCredentials({ email, password });
  const rejected = await authenticateCredentials({
    email,
    password: "incorrect-password",
  });

  assert.equal(authenticated?.id, userId);
  assert.equal("passwordHash" in (authenticated ?? {}), false);
  assert.equal(rejected, null);
});

test("onboarding creates one organisation with an OWNER membership", async () => {
  assert.ok(userId);
  const results = await Promise.all([
    createFirstOrganizationForUser(userId, `${marker} organisation`),
    createFirstOrganizationForUser(userId, `${marker} organisation`),
  ]);
  const created = results.find((result) => result.status === "created");

  assert.ok(created && "organizationId" in created);
  createdOrganizationIds.push(created.organizationId);
  assert.equal(
    results.filter((result) => result.status === "created").length,
    1,
  );
  assert.equal(
    results.filter((result) => result.status === "already-onboarded").length,
    1,
  );

  const membership = await prisma.membership.findUniqueOrThrow({
    where: {
      userId_organizationId: {
        userId,
        organizationId: created.organizationId,
      },
    },
    include: { organization: true },
  });
  assert.equal(membership.role, MembershipRole.OWNER);
  assert.equal(membership.organization.id, created.organizationId);

  const repeated = await createFirstOrganizationForUser(
    userId,
    "A second organisation must not be created",
  );
  assert.equal(repeated.status, "already-onboarded");
});

test("organisation access requires the matching user membership", async () => {
  assert.ok(userId);
  const ownOrganizationId = createdOrganizationIds[0];
  const otherOrganization = await prisma.organization.create({
    data: { name: `${marker} inaccessible` },
    select: { id: true },
  });
  createdOrganizationIds.push(otherOrganization.id);

  const ownAccess = await getOrganizationMembership(userId, ownOrganizationId);
  const crossOrganizationAccess = await getOrganizationMembership(
    userId,
    otherOrganization.id,
  );

  assert.equal(ownAccess?.organization.id, ownOrganizationId);
  assert.equal(crossOrganizationAccess, null);
});
