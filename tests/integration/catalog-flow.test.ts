import "dotenv/config";

import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import {
  getCatalogItemForOrganization,
  listCatalogItemsForOrganization,
} from "../../lib/catalog/queries";
import {
  archiveCatalogItemForOrganization,
  createCatalogItemForOrganization,
  updateCatalogItemForOrganization,
} from "../../lib/catalog/service";
import { prisma } from "../../lib/prisma";
import { catalogItemSchema } from "../../lib/validation/catalog-item";

const marker = `catalog-test-${Date.now()}-${Math.random()
  .toString(36)
  .slice(2)}`;
let organizationAId: string;
let organizationBId: string;
let itemAId: string;
let itemBId: string;

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

test("catalog creation assigns the trusted organisation and exact decimals", async () => {
  const itemA = await createCatalogItemForOrganization(
    organizationAId,
    catalogItemSchema.parse({
      name: "Alpha Service",
      description: `${marker} design service`,
      sku: "ALPHA-001",
      unit: "hour",
      unitPrice: "1234.50",
      taxRate: "15.25",
    }),
  );
  const itemB = await createCatalogItemForOrganization(
    organizationBId,
    catalogItemSchema.parse({
      name: "Beta Product",
      description: `${marker} hardware product`,
      unit: "each",
      unitPrice: "99.99",
      taxRate: "0",
    }),
  );
  itemAId = itemA.id;
  itemBId = itemB.id;

  assert.equal(itemA.organizationId, organizationAId);
  assert.equal(itemA.unitPrice.toFixed(2), "1234.50");
  assert.equal(itemA.taxRate.toFixed(2), "15.25");
  assert.equal(itemA.isActive, true);
});

test("catalog list and search are active-organisation scoped", async () => {
  const allA = await listCatalogItemsForOrganization(organizationAId, "");
  const alphaSearch = await listCatalogItemsForOrganization(
    organizationAId,
    "ALPHA-001",
  );
  const betaSearchFromA = await listCatalogItemsForOrganization(
    organizationAId,
    "Beta Product",
  );

  assert.deepEqual(allA.map((item) => item.id), [itemAId]);
  assert.deepEqual(alphaSearch.map((item) => item.id), [itemAId]);
  assert.equal(betaSearchFromA.length, 0);
});

test("cross-organisation reads and updates are rejected", async () => {
  const crossTenantRead = await getCatalogItemForOrganization(
    organizationAId,
    itemBId,
  );
  const crossTenantUpdate = await updateCatalogItemForOrganization(
    organizationAId,
    itemBId,
    catalogItemSchema.parse({
      name: "Compromised Item",
      description: "Cross-tenant update attempt",
      unit: "each",
      unitPrice: "1.00",
      taxRate: "0.00",
    }),
  );
  const unchanged = await getCatalogItemForOrganization(
    organizationBId,
    itemBId,
  );

  assert.equal(crossTenantRead, null);
  assert.equal(crossTenantUpdate, null);
  assert.equal(unchanged?.name, "Beta Product");
});

test("catalog update persists exact decimals on the scoped active record", async () => {
  const updated = await updateCatalogItemForOrganization(
    organizationAId,
    itemAId,
    catalogItemSchema.parse({
      name: "Alpha Service Updated",
      description: "Updated design service",
      sku: "ALPHA-002",
      unit: "project",
      unitPrice: "999999.01",
      taxRate: "20.50",
    }),
  );
  const stored = await getCatalogItemForOrganization(organizationAId, itemAId);

  assert.equal(updated?.id, itemAId);
  assert.equal(stored?.name, "Alpha Service Updated");
  assert.equal(stored?.unitPrice.toFixed(2), "999999.01");
  assert.equal(stored?.taxRate.toFixed(2), "20.50");
});

test("archive is scoped, soft, and excluded from the active list", async () => {
  const crossTenantArchive = await archiveCatalogItemForOrganization(
    organizationBId,
    itemAId,
  );
  const ownArchive = await archiveCatalogItemForOrganization(
    organizationAId,
    itemAId,
  );
  const activeList = await listCatalogItemsForOrganization(organizationAId, "");
  const archivedRecord = await getCatalogItemForOrganization(
    organizationAId,
    itemAId,
  );

  assert.equal(crossTenantArchive, false);
  assert.equal(ownArchive, true);
  assert.equal(activeList.length, 0);
  assert.equal(archivedRecord?.isActive, false);
});
