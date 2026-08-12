import { z } from "zod";

const MAX_EMAIL_LENGTH = 254;
const MAX_NAME_PART_LENGTH = 50;
const MAX_BCRYPT_PASSWORD_BYTES = 72;

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(MAX_EMAIL_LENGTH, "Email address is too long.")
  .email("Enter a valid email address.");

const bcryptPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .refine(
    (password) =>
      new TextEncoder().encode(password).length <= MAX_BCRYPT_PASSWORD_BYTES,
    "Password must be no more than 72 bytes.",
  );

const namePartSchema = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(MAX_NAME_PART_LENGTH, `${label} is too long.`);

export const registrationSchema = z
  .object({
    firstName: namePartSchema("First name"),
    lastName: namePartSchema("Last name"),
    email: emailSchema,
    password: bcryptPasswordSchema,
  })
  .transform(({ firstName, lastName, ...values }) => ({
    ...values,
    name: `${firstName} ${lastName}`,
  }));

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1)
    .refine(
      (password) =>
        new TextEncoder().encode(password).length <= MAX_BCRYPT_PASSWORD_BYTES,
    ),
});

