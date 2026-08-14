# QuoteKit Project Status

## Current sprint

Auth Sprint 5: Authentication completion, development seed, documentation and hardening.

## Completed

- Verified the full credentials flow from registration through onboarding, protected application access, session display, and logout.
- Kept bcrypt password hashing asynchronous at cost 12, with 8-character minimum and 72-byte maximum registration validation.
- Extracted server-only credential verification and registration services so production behavior is directly integration tested.
- Added an idempotent, production-disabled development seed for one user, one organisation, and one OWNER membership.
- Added explicit Node version and reusable typecheck, unit-test, integration-test, combined-test, and seed commands.
- Added focused validation, password, safe-redirect, role, registration, login, onboarding concurrency, relationship, and cross-tenant tests.
- Added a pending state to the existing logout control without redesigning the application shell.
- Documented environment variables, installation, Prisma workflows, validation commands, auth testing, and relevant troubleshooting.
- Confirmed session and tenant helpers return deliberately minimal data and never return `passwordHash`.
- Confirmed the shared server layout remains the protected-route security boundary; no middleware-only or client-only authorization was added.
- Configured Auth.js to trust the Next.js host boundary explicitly, preventing `UntrustedHost` failures in both development and local production mode.
- Kept Customer, Catalog, and Quote pages on their existing mock data.

## Security controls

- User identity is derived from the Auth.js server session and verified against PostgreSQL.
- Registration email addresses are trimmed and lowercased; database uniqueness safely handles races.
- Credential failures return a generic login error and credential verification never returns the password hash.
- Redirect destinations accept only safe internal paths and avoid auth-page loops.
- Onboarding derives the user and OWNER role on the server and creates organisation and membership in a serializable transaction with retry handling.
- Active organisation selection is deterministic and requires an active organisation membership.
- Requested organisation IDs are checked against both the authenticated user ID and organisation ID.
- Role checks use explicit allowed-role lists; no implicit privilege hierarchy is assumed.
- Prisma, credentials services, password helpers, and access helpers remain server-only.

## Validation

- Prisma format, validate, generate, and migration status: passed; the database is up to date.
- TypeScript validation: passed.
- ESLint: passed.
- Unit tests: 7 passed.
- PostgreSQL integration tests: 4 passed; temporary test records removed.
- Development seed: passed twice to verify idempotency.
- Seed inspection: bcrypt-formatted hash, OWNER role, active organisation, and relationship verified without printing the hash.
- Production build: passed.
- Production start smoke test: passed with a configured local Auth.js origin; `/` returned 200 and logged-out `/dashboard` returned a 307 redirect to `/login`.
- Playwright end-to-end tests: not configured; browser flow remains a manual check.

## Remaining limitations

- No password reset, email verification, MFA, social login, or rate limiting.
- No organisation switching or additional organisation creation UI.
- No browser automation suite is configured.
- Customers, Catalog, Quotes, and quote line items remain mock-data features.

## Next recommended sprint

Implement the Customer backend and CRUD foundation. Add the Customer Prisma model and migration, organisation-scoped server reads and Server Actions, Zod validation, tenant-isolation tests, and loading, empty, error, and success states while reusing the existing customer UI.
