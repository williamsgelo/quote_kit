# QuoteKit Project Status

## Current sprint

Sprint 9: Quote delivery and customer interaction — complete on `feat/sprint-9-quote-delivery`.

## Delivery workflow

- DRAFT Quotes with a Customer email address can be sent from the existing internal Quote detail page.
- Sending generates or reuses one cryptographically secure public token, builds a trusted `/q/<token>` URL, attempts email delivery through Resend, then records SENT only after provider success.
- Internal users can copy or open the public link after successful delivery.
- The unauthenticated public page renders persisted Quote and QuoteItem snapshots, message, terms, totals, and response state.
- Public Accept and Confirm decline actions identify the Quote only through the validated token.
- Quote detail displays a real activity timeline; dashboard cards and recent activity now use delivery data.

## Token and public-access security

- Tokens contain 32 random bytes (256 bits) encoded as a 43-character base64url value using Node `crypto.randomBytes`.
- `Quote.publicToken` is nullable, unique, and limited to 64 characters; each Quote keeps at most one token for the MVP.
- Public URLs do not contain Quote IDs, quote numbers, organisation IDs, or user IDs.
- DRAFT tokens do not resolve publicly, including tokens allocated before a failed email attempt.
- Invalid/inactive tokens return the same safe not-found page.
- The public query deliberately excludes internal notes, memberships, users, authentication information, and activity history.
- Internal send/token/activity access remains constrained by Quote ID plus the session-derived active organisation ID.

## Status, viewed, and response rules

- Explicit server transitions allow DRAFT → SENT and SENT → VIEWED.
- SENT or VIEWED may become ACCEPTED or DECLINED.
- ACCEPTED and DECLINED are terminal through public actions and cannot be reversed.
- Repeated same responses are idempotent and do not duplicate activity.
- First public access sets `firstViewedAt`, records one VIEWED activity, and upgrades SENT to VIEWED.
- Refreshes do not create repeated VIEWED events; viewing ACCEPTED/DECLINED never downgrades status.
- The business user opening the public link also counts as a view for this MVP.

## Email behavior

- Resend is called through a small server-only HTTP adapter; no additional email package was necessary.
- Email contains the business/customer names, Quote number, total, expiry date, and public link; it excludes internal notes and PDF attachments.
- Required variables are `APP_URL`, `RESEND_API_KEY`, and `EMAIL_FROM`.
- `APP_URL` must be a plain trusted HTTP/HTTPS origin and must use HTTPS in production.
- Email is attempted before SENT persistence. Provider/configuration failure leaves the Quote DRAFT with no `sentAt` or SENT activity so it can be retried.
- Tests inject a fake provider and never send real email.

## Expiry and dashboard behavior

- Expiry is derived after the end of the stored `expiryDate`; no scheduler or automatic EXPIRED persistence was added.
- Expired Quotes remain readable but cannot be newly accepted. Decline remains available.
- Dashboard awaiting-response count includes SENT and VIEWED.
- Accepted value includes ACCEPTED Quotes only.
- Conversion is `accepted / (accepted + declined)`; undecided Quotes are excluded.

## Database changes

- Added `QuoteActivityType`: CREATED, UPDATED, SENT, VIEWED, ACCEPTED, DECLINED.
- Added Quote `publicToken`, `sentAt`, `firstViewedAt`, `acceptedAt`, and `declinedAt`.
- Added QuoteActivity with Quote cascade relation and `(quoteId, createdAt)` index.
- Added a unique index for public tokens.
- Draft creation/update now record CREATED/UPDATED activity in their existing transactions.
- Migration `20260825162206_quote_delivery` was reviewed and applied successfully without resetting existing data.

## Validation

- Prisma format: passed.
- Prisma validate: passed.
- Prisma Client generation: passed.
- Prisma migration status: database up to date with all 5 migrations.
- TypeScript: passed.
- ESLint: passed with no warnings.
- Unit tests: 36 passed, including 6 new delivery/token/transition tests.
- Full PostgreSQL integration suite: 34 passed, including 8 new delivery tests.
- Focused post-hardening delivery integration rerun: 8 passed.
- Production build: passed and includes `/q/[token]`.
- Production smoke: `/` and `/login` returned 200; `/quotes` redirected to `/login`; invalid public token returned 404.
- `git diff --check`: passed.
- Browser automation was unavailable because no controllable browser was attached.

## Remaining limitations

- A real Resend message was not sent during automated validation; a verified sender/domain and production API key must be tested manually.
- Email and database status cannot form one distributed transaction. If email succeeds but the subsequent database transaction fails, the user must retry; SENT is never falsely recorded before provider success.
- Concurrent independent send requests may result in duplicate provider emails, although status transitions and the pending UI prevent invalid database state changes.
- Public link rotation/revocation, business-view exclusion, decline reasons, automatic expiry jobs, PDFs, invoices, payments, e-signatures, customer portals, and advanced approvals are not implemented.

## Vercel readiness

The application code, schema, migration, tests, and production build are ready for Vercel deployment after `APP_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, existing auth/database variables, and a verified Resend sender are configured. Run `npx prisma migrate deploy` during deployment and complete one real staging email/public Accept/Decline walkthrough before production release.

## Next recommended sprint

PDF generation and branded Quote documents, followed by invoice conversion only after the delivery workflow has been verified in staging.
