import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { retryTransientDatabaseRead } from "@/lib/prisma-retry";

export type CredentialsRegistration = {
  name: string;
  email: string;
  password: string;
};

export type CreateCredentialsUserResult =
  | { status: "created"; userId: string }
  | { status: "duplicate" };

export async function createCredentialsUser(
  registration: CredentialsRegistration,
): Promise<CreateCredentialsUserResult> {
  const email = registration.email.trim().toLowerCase();
  const existingUser = await retryTransientDatabaseRead(() =>
    prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
      select: { id: true },
    }),
  );

  if (existingUser) {
    return { status: "duplicate" };
  }

  const passwordHash = await hashPassword(registration.password);

  try {
    const user = await prisma.user.create({
      data: {
        name: registration.name,
        email,
        passwordHash,
      },
      select: { id: true },
    });

    return { status: "created", userId: user.id };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { status: "duplicate" };
    }

    throw error;
  }
}
