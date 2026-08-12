"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { Prisma } from "@/generated/prisma/client";
import { requireUser } from "@/lib/auth/access";
import { createFirstOrganizationForUser } from "@/lib/organizations/onboarding";
import { onboardingSchema } from "@/lib/validation/onboarding";

export type OnboardingActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: {
    organizationName?: string[];
  };
};

function reportOnboardingError(error: unknown) {
  const details =
    error instanceof Prisma.PrismaClientKnownRequestError
      ? { name: error.name, code: error.code, meta: error.meta }
      : {
          name: error instanceof Error ? error.name : "UnknownError",
          message: error instanceof Error ? error.message : "Unknown error",
        };

  console.info(
    `[onboarding] Workspace creation failed: ${JSON.stringify(details)}`,
  );
}

export async function createOrganizationAction(
  _previousState: OnboardingActionState,
  formData: FormData,
): Promise<OnboardingActionState> {
  const user = await requireUser("/onboarding");
  const parsedOnboarding = onboardingSchema.safeParse({
    organizationName: formData.get("organizationName"),
  });

  if (!parsedOnboarding.success) {
    return {
      status: "error",
      message: "Check the business name and try again.",
      fieldErrors: parsedOnboarding.error.flatten().fieldErrors,
    };
  }

  try {
    await createFirstOrganizationForUser(
      user.id,
      parsedOnboarding.data.organizationName,
    );
  } catch (error) {
    reportOnboardingError(error);

    return {
      status: "error",
      message: "We could not create your workspace. Please try again.",
    };
  }

  revalidatePath("/onboarding");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
