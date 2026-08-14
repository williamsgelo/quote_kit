import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

import { MembershipRole, PrismaClient } from "../generated/prisma/client";

const BCRYPT_COST = 12;
const DEVELOPMENT_ORGANIZATION_ID = "quotekit-development-organization";

function requiredEnvironmentValue(name: string) {
  const value = process.env[name]?.trim();

  if (!value || value.startsWith("replace-with")) {
    throw new Error(`${name} must be set to a development-only value.`);
  }

  return value;
}

function preserveCurrentSslSemantics(connectionString: string) {
  return connectionString.replace(
    /([?&])sslmode=(?:prefer|require|verify-ca)(?=&|$)/i,
    "$1sslmode=verify-full",
  );
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("The development seed is disabled in production.");
  }

  const connectionString = requiredEnvironmentValue("DATABASE_URL");
  const email = requiredEnvironmentValue("SEED_USER_EMAIL").toLowerCase();
  const password = requiredEnvironmentValue("SEED_USER_PASSWORD");
  const organizationName = requiredEnvironmentValue(
    "SEED_ORGANIZATION_NAME",
  );
  const name = process.env.SEED_USER_NAME?.trim() || "Development Owner";

  if (
    password.length < 8 ||
    new TextEncoder().encode(password).length > 72
  ) {
    throw new Error("SEED_USER_PASSWORD must be between 8 and 72 bytes.");
  }
  const adapter = new PrismaPg({
    connectionString: preserveCurrentSslSemantics(connectionString),
  });
  const prisma = new PrismaClient({ adapter });

  try {
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, passwordHash },
      create: { name, email, passwordHash },
      select: { id: true },
    });
    const organization = await prisma.organization.upsert({
      where: { id: DEVELOPMENT_ORGANIZATION_ID },
      update: { name: organizationName, isActive: true },
      create: {
        id: DEVELOPMENT_ORGANIZATION_ID,
        name: organizationName,
      },
      select: { id: true },
    });

    await prisma.membership.upsert({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: organization.id,
        },
      },
      update: { role: MembershipRole.OWNER },
      create: {
        userId: user.id,
        organizationId: organization.id,
        role: MembershipRole.OWNER,
      },
    });

    console.info("Development user, organisation, and OWNER membership seeded.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Seed failed.");
  process.exitCode = 1;
});
