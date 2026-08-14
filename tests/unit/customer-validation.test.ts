import assert from "node:assert/strict";
import test from "node:test";

import { customerSchema } from "../../lib/validation/customer";

test("customer validation trims values and normalises empty optional fields", () => {
  const customer = customerSchema.parse({
    name: "  Ada Lovelace  ",
    companyName: "  Analytical Engines  ",
    email: " ADA@EXAMPLE.COM ",
    phone: " +27 82 123 4567 ",
    taxNumber: "",
    addressLine1: "",
    addressLine2: "  ",
    city: " Cape Town ",
    province: "",
    postalCode: "8001",
    country: " South Africa ",
    notes: "",
  });

  assert.equal(customer.name, "Ada Lovelace");
  assert.equal(customer.companyName, "Analytical Engines");
  assert.equal(customer.email, "ada@example.com");
  assert.equal(customer.phone, "+27 82 123 4567");
  assert.equal(customer.taxNumber, null);
  assert.equal(customer.addressLine1, null);
  assert.equal(customer.addressLine2, null);
  assert.equal(customer.city, "Cape Town");
  assert.equal(customer.notes, null);
});

test("customer validation rejects invalid required and contact values", () => {
  const invalid = customerSchema.safeParse({
    name: " ",
    email: "not-an-email",
    phone: "invalid phone",
    notes: "n".repeat(2_001),
  });

  assert.equal(invalid.success, false);
  assert.ok(invalid.error?.flatten().fieldErrors.name?.length);
  assert.ok(invalid.error?.flatten().fieldErrors.email?.length);
  assert.ok(invalid.error?.flatten().fieldErrors.phone?.length);
  assert.ok(invalid.error?.flatten().fieldErrors.notes?.length);
});
