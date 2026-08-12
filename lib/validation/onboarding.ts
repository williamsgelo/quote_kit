import { z } from "zod";

const MIN_ORGANIZATION_NAME_LENGTH = 2;
const MAX_ORGANIZATION_NAME_LENGTH = 100;

export const onboardingSchema = z.object({
  organizationName: z
    .string()
    .trim()
    .min(
      MIN_ORGANIZATION_NAME_LENGTH,
      "Business name must be at least 2 characters.",
    )
    .max(
      MAX_ORGANIZATION_NAME_LENGTH,
      "Business name must be no more than 100 characters.",
    ),
});
