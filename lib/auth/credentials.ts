import "server-only";

import { verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { retryTransientDatabaseRead } from "@/lib/prisma-retry";
import { loginSchema } from "@/lib/validation/auth";

export async function authenticateCredentials(credentials: unknown) {
  const parsedCredentials = loginSchema.safeParse(credentials);

  if (!parsedCredentials.success) {
    return null;
  }

  const user = await retryTransientDatabaseRead(() =>
    prisma.user.findFirst({
      where: {
        email: {
          equals: parsedCredentials.data.email,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        passwordHash: true,
      },
    }),
  );

  if (
    !user?.passwordHash ||
    !(await verifyPassword(parsedCredentials.data.password, user.passwordHash))
  ) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  };
}
