import "server-only";

import { randomBytes } from "node:crypto";

const PUBLIC_TOKEN_BYTES = 32;
const PUBLIC_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export function generateQuotePublicToken() {
  return randomBytes(PUBLIC_TOKEN_BYTES).toString("base64url");
}

export function isValidQuotePublicToken(token: string) {
  return PUBLIC_TOKEN_PATTERN.test(token);
}
