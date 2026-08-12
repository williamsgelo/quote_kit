import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation/auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const user = await prisma.user.findFirst({
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
        });

        if (
          !user?.passwordHash ||
          !(await verifyPassword(
            parsedCredentials.data.password,
            user.passwordHash,
          ))
        ) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
});

