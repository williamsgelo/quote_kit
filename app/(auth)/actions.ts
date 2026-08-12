"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import { Prisma } from "@/generated/prisma/client";
import { hashPassword } from "@/lib/auth/password";
import { getSafeRedirectPath } from "@/lib/auth/redirect";
import { prisma } from "@/lib/prisma";
import { loginSchema, registrationSchema } from "@/lib/validation/auth";

type RegistrationField = "firstName" | "lastName" | "email" | "password";

export type RegistrationActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<RegistrationField, string[]>>;
};

export type LoginActionState = {
  status: "idle" | "error";
  message?: string;
};

const DUPLICATE_ACCOUNT_MESSAGE =
  "An account with this email already exists.";

export async function registerAction(
  _previousState: RegistrationActionState,
  formData: FormData,
): Promise<RegistrationActionState> {
  const parsedRegistration = registrationSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsedRegistration.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors: parsedRegistration.error.flatten().fieldErrors,
    };
  }

  const { email, name, password } = parsedRegistration.data;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
      select: { id: true },
    });

    if (existingUser) {
      return {
        status: "error",
        message: DUPLICATE_ACCOUNT_MESSAGE,
        fieldErrors: { email: [DUPLICATE_ACCOUNT_MESSAGE] },
      };
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: { id: true },
    });

    return { status: "success" };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        status: "error",
        message: DUPLICATE_ACCOUNT_MESSAGE,
        fieldErrors: { email: [DUPLICATE_ACCOUNT_MESSAGE] },
      };
    }

    return {
      status: "error",
      message: "We could not create your account. Please try again.",
    };
  }
}

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const parsedCredentials = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsedCredentials.success) {
    return {
      status: "error",
      message: "Invalid email or password.",
    };
  }

  const redirectTo = getSafeRedirectPath(formData.get("callbackUrl"));

  try {
    await signIn("credentials", {
      ...parsedCredentials.data,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        status: "error",
        message:
          error.type === "CredentialsSignin"
            ? "Invalid email or password."
            : "We could not log you in. Please try again.",
      };
    }

    throw error;
  }

  return {
    status: "error",
    message: "We could not log you in. Please try again.",
  };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
