import assert from "node:assert/strict";
import test from "node:test";

import {
  isDecimalAtMost,
  normalizeDecimalString,
} from "../../lib/money";
import { catalogItemSchema } from "../../lib/validation/catalog-item";

test("catalog validation trims text and normalises exact decimal values", () => {
  const item = catalogItemSchema.parse({
    name: "  Website design  ",
    description: "  Responsive design service  ",
    sku: "  SERVICE-001  ",
    unit: "project",
    unitPrice: "1250.5",
    taxRate: "15",
  });

  assert.equal(item.name, "Website design");
  assert.equal(item.description, "Responsive design service");
  assert.equal(item.sku, "SERVICE-001");
  assert.equal(item.unitPrice, "1250.50");
  assert.equal(item.taxRate, "15.00");
});

test("catalog validation normalises an empty SKU to null", () => {
  const item = catalogItemSchema.parse({
    name: "Consulting",
    description: "Technical consulting",
    sku: "  ",
    unit: "hour",
    unitPrice: "0",
    taxRate: "0.00",
  });

  assert.equal(item.sku, null);
  assert.equal(item.unitPrice, "0.00");
});

test("catalog validation rejects unsafe price, tax, unit, and SKU values", () => {
  const invalid = catalogItemSchema.safeParse({
    name: "x",
    description: " ",
    sku: "invalid sku!",
    unit: "kilogram",
    unitPrice: "-1.00",
    taxRate: "100.01",
  });

  assert.equal(invalid.success, false);
  assert.ok(invalid.error?.flatten().fieldErrors.name?.length);
  assert.ok(invalid.error?.flatten().fieldErrors.description?.length);
  assert.ok(invalid.error?.flatten().fieldErrors.sku?.length);
  assert.ok(invalid.error?.flatten().fieldErrors.unit?.length);
  assert.ok(invalid.error?.flatten().fieldErrors.unitPrice?.length);
  assert.ok(invalid.error?.flatten().fieldErrors.taxRate?.length);
});

test("decimal bounds are checked without floating-point arithmetic", () => {
  assert.equal(normalizeDecimalString("0.1"), "0.10");
  assert.equal(isDecimalAtMost("99999999999999999.99", "99999999999999999.99"), true);
  assert.equal(isDecimalAtMost("100.01", "100.00"), false);
});
