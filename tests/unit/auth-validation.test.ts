import assert from "node:assert/strict";
import test from "node:test";

import { getSafeRedirectPath } from "../../lib/auth/redirect";
import { loginSchema, registrationSchema } from "../../lib/validation/auth";
import { onboardingSchema } from "../../lib/validation/onboarding";

test("registration normalises valid account input", () => {
  const parsed = registrationSchema.parse({
    firstName: "  Ada ",
    lastName: " Lovelace  ",
    email: " ADA@EXAMPLE.COM ",
    password: "development-password",
  });

  assert.deepEqual(parsed, {
    name: "Ada Lovelace",
    email: "ada@example.com",
    password: "development-password",
  });
});

test("registration rejects short and bcrypt-truncated passwords", () => {
  const base = {
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
  };

  assert.equal(
    registrationSchema.safeParse({ ...base, password: "short" }).success,
    false,
  );
  assert.equal(
    registrationSchema.safeParse({ ...base, password: "a".repeat(73) })
      .success,
    false,
  );
});

test("login schema normalises email and rejects empty passwords", () => {
  assert.equal(
    loginSchema.parse({ email: " USER@EXAMPLE.COM ", password: "password" })
      .email,
    "user@example.com",
  );
  const emptyPassword = loginSchema.safeParse({
    email: "user@example.com",
    password: "",
  });
  assert.equal(emptyPassword.success, false);
  assert.equal(
    emptyPassword.error?.flatten().fieldErrors.password?.[0],
    "Password is required.",
  );
});

test("onboarding trims names and rejects empty or whitespace-only values", () => {
  assert.equal(
    onboardingSchema.parse({ organizationName: "  Acme Studio  " })
      .organizationName,
    "Acme Studio",
  );
  assert.equal(
    onboardingSchema.safeParse({ organizationName: "" }).success,
    false,
  );
  assert.equal(
    onboardingSchema.safeParse({ organizationName: "   " }).success,
    false,
  );
});

test("auth redirects accept internal paths and reject unsafe destinations", () => {
  assert.equal(getSafeRedirectPath("/customers?page=2"), "/customers?page=2");
  assert.equal(getSafeRedirectPath("https://evil.example"), "/onboarding");
  assert.equal(getSafeRedirectPath("//evil.example"), "/onboarding");
  assert.equal(getSafeRedirectPath("/login"), "/onboarding");
});
