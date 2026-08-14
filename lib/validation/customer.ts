import { z } from "zod";

const optionalText = (label: string, maximum: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? null : value,
    z
      .string()
      .trim()
      .max(maximum, `${label} must be no more than ${maximum} characters.`)
      .nullable()
      .optional(),
  ).transform((value) => value ?? null);

const optionalEmail = z
  .preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? null : value,
    z
      .string()
      .trim()
      .toLowerCase()
      .max(254, "Email address is too long.")
      .email("Enter a valid email address.")
      .nullable()
      .optional(),
  )
  .transform((value) => value ?? null);

const optionalPhone = z
  .preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? null : value,
    z
      .string()
      .trim()
      .max(30, "Phone number must be no more than 30 characters.")
      .regex(
        /^[+\d][\d\s().-]{5,29}$/,
        "Enter a valid phone number.",
      )
      .nullable()
      .optional(),
  )
  .transform((value) => value ?? null);

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters.")
    .max(100, "Customer name must be no more than 100 characters."),
  companyName: optionalText("Company name", 120),
  email: optionalEmail,
  phone: optionalPhone,
  taxNumber: optionalText("Tax number", 50),
  addressLine1: optionalText("Address line 1", 150),
  addressLine2: optionalText("Address line 2", 150),
  city: optionalText("City", 100),
  province: optionalText("Province", 100),
  postalCode: optionalText("Postal code", 20),
  country: optionalText("Country", 100),
  notes: optionalText("Notes", 2_000),
});

export type CustomerInput = z.infer<typeof customerSchema>;
