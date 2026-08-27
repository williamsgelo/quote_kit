import assert from "node:assert/strict";
import test from "node:test";

import { QuoteStatus } from "../../generated/prisma/client";
import {
  generateQuotePublicToken,
  isValidQuotePublicToken,
} from "../../lib/quotes/public-token";
import {
  isQuoteExpired,
  QuoteTransitionError,
  transitionQuoteStatus,
} from "../../lib/quotes/transitions";

test("supports every allowed delivery and customer-response transition", () => {
  assert.equal(
    transitionQuoteStatus(QuoteStatus.DRAFT, "SEND").status,
    QuoteStatus.SENT,
  );
  assert.equal(
    transitionQuoteStatus(QuoteStatus.SENT, "VIEW").status,
    QuoteStatus.VIEWED,
  );
  assert.equal(
    transitionQuoteStatus(QuoteStatus.VIEWED, "ACCEPT").status,
    QuoteStatus.ACCEPTED,
  );
  assert.equal(
    transitionQuoteStatus(QuoteStatus.VIEWED, "DECLINE").status,
    QuoteStatus.DECLINED,
  );
  assert.equal(
    transitionQuoteStatus(QuoteStatus.SENT, "ACCEPT").status,
    QuoteStatus.ACCEPTED,
  );
  assert.equal(
    transitionQuoteStatus(QuoteStatus.SENT, "DECLINE").status,
    QuoteStatus.DECLINED,
  );
});

test("terminal customer responses cannot be reversed publicly", () => {
  assert.throws(
    () => transitionQuoteStatus(QuoteStatus.ACCEPTED, "DECLINE"),
    QuoteTransitionError,
  );
  assert.throws(
    () => transitionQuoteStatus(QuoteStatus.DECLINED, "ACCEPT"),
    QuoteTransitionError,
  );
});

test("view tracking never downgrades viewed or terminal states", () => {
  for (const status of [
    QuoteStatus.VIEWED,
    QuoteStatus.ACCEPTED,
    QuoteStatus.DECLINED,
  ]) {
    assert.deepEqual(transitionQuoteStatus(status, "VIEW"), {
      status,
      changed: false,
    });
  }
});

test("invalid send and public transitions are rejected", () => {
  assert.throws(
    () => transitionQuoteStatus(QuoteStatus.SENT, "SEND"),
    QuoteTransitionError,
  );
  assert.throws(
    () => transitionQuoteStatus(QuoteStatus.DRAFT, "VIEW"),
    QuoteTransitionError,
  );
  assert.throws(
    () => transitionQuoteStatus(QuoteStatus.DRAFT, "ACCEPT"),
    QuoteTransitionError,
  );
});

test("public tokens use 256-bit secure base64url output and remain unique", () => {
  const tokens = Array.from({ length: 250 }, generateQuotePublicToken);
  assert.equal(new Set(tokens).size, tokens.length);
  assert.ok(tokens.every(isValidQuotePublicToken));
  assert.ok(tokens.every((token) => token.length === 43));
  assert.equal(isValidQuotePublicToken("quote-id-123"), false);
  assert.equal(isValidQuotePublicToken("a".repeat(64)), false);
});

test("expiry is derived after the end of the stored expiry date", () => {
  const expiryDate = new Date("2026-08-25T00:00:00.000Z");
  assert.equal(
    isQuoteExpired(expiryDate, new Date("2026-08-25T23:59:59.000Z")),
    false,
  );
  assert.equal(
    isQuoteExpired(expiryDate, new Date("2026-08-26T00:00:00.000Z")),
    true,
  );
});
