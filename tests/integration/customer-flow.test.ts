import "dotenv/config";

import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import {
  getCustomerForOrganization,
  listCustomersForOrganization,
} from "../../lib/customers/queries";
import {
  archiveCustomerForOrganization,
  createCustomerForOrganization,
  updateCustomerForOrganization,
} from "../../lib/customers/service";
import { prisma } from "../../lib/prisma";
import { customerSchema } from "../../lib/validation/customer";

const marker = `customer-test-${Date.now()}-${Math.random()
  .toString(36)
  .slice(2)}`;
let organizationAId: string;
let organizationBId: string;
let customerAId: string;
let customerBId: string;

before(async () => {
  const [organizationA, organizationB] = await Promise.all([
    prisma.organization.create({
      data: { name: `${marker} organisation A` },
      select: { id: true },
    }),
    prisma.organization.create({
      data: { name: `${marker} organisation B` },
      select: { id: true },
    }),
  ]);
  organizationAId = organizationA.id;
  organizationBId = organizationB.id;
});

after(async () => {
  await prisma.organization.deleteMany({
    where: { id: { in: [organizationAId, organizationBId].filter(Boolean) } },
  });
  await prisma.$disconnect();
});

test("customer creation assigns the supplied trusted organisation", async () => {
  const customerA = await createCustomerForOrganization(
    organizationAId,
    customerSchema.parse({
      name: "Alpha Customer",
      companyName: `${marker} Alpha Company`,
      email: "ALPHA@EXAMPLE.TEST",
      phone: "+27 82 123 4567",
      notes: "Organisation A customer",
    }),
  );
  const customerB = await createCustomerForOrganization(
    organizationBId,
    customerSchema.parse({
      name: "Beta Customer",
      companyName: `${marker} Beta Company`,
      email: "beta@example.test",
    }),
  );
  customerAId = customerA.id;
  customerBId = customerB.id;

  assert.equal(customerA.organizationId, organizationAId);
  assert.equal(customerB.organizationId, organizationBId);
  assert.equal(customerA.isArchived, false);
});

test("customer list and search are active-organisation scoped", async () => {
  const allA = await listCustomersForOrganization(organizationAId, "");
  const alphaSearch = await listCustomersForOrganization(
    organizationAId,
    "Alpha Company",
  );
  const betaSearchFromA = await listCustomersForOrganization(
    organizationAId,
    "Beta Company",
  );

  assert.deepEqual(allA.map((customer) => customer.id), [customerAId]);
  assert.deepEqual(alphaSearch.map((customer) => customer.id), [customerAId]);
  assert.equal(betaSearchFromA.length, 0);
});

test("cross-organisation reads and updates are rejected", async () => {
  const crossTenantRead = await getCustomerForOrganization(
    organizationAId,
    customerBId,
  );
  const crossTenantUpdate = await updateCustomerForOrganization(
    organizationAId,
    customerBId,
    customerSchema.parse({ name: "Compromised Customer" }),
  );
  const unchanged = await getCustomerForOrganization(
    organizationBId,
    customerBId,
  );

  assert.equal(crossTenantRead, null);
  assert.equal(crossTenantUpdate, null);
  assert.equal(unchanged?.name, "Beta Customer");
});

test("customer update changes only the scoped active record", async () => {
  const updated = await updateCustomerForOrganization(
    organizationAId,
    customerAId,
    customerSchema.parse({
      name: "Alpha Customer Updated",
      email: "UPDATED@EXAMPLE.TEST",
      notes: "Updated notes",
    }),
  );
  const stored = await getCustomerForOrganization(
    organizationAId,
    customerAId,
  );

  assert.equal(updated?.id, customerAId);
  assert.equal(stored?.name, "Alpha Customer Updated");
  assert.equal(stored?.email, "updated@example.test");
});

test("archive is scoped, soft, and excluded from the active list", async () => {
  const crossTenantArchive = await archiveCustomerForOrganization(
    organizationBId,
    customerAId,
  );
  const ownArchive = await archiveCustomerForOrganization(
    organizationAId,
    customerAId,
  );
  const activeList = await listCustomersForOrganization(organizationAId, "");
  const archivedRecord = await getCustomerForOrganization(
    organizationAId,
    customerAId,
  );

  assert.equal(crossTenantArchive, false);
  assert.equal(ownArchive, true);
  assert.equal(activeList.length, 0);
  assert.equal(archivedRecord?.isArchived, true);
});
