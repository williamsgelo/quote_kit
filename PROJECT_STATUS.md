# QuoteKit Project Status

## Current sprint

Auth Sprint 2: Credentials authentication with bcrypt.

## Completed

- Preserved the root-level App Router authentication UI and mock business-data flows.
- Added Auth.js v5 Credentials authentication with the existing Prisma adapter.
- Added JWT sessions containing the safe user fields `id`, `name`, `email`, and `image`.
- Added Zod-validated registration and login Server Actions.
- Added server-only asynchronous bcrypt hashing and verification with cost factor 12.
- Added case-normalized email registration and case-insensitive lookup.
- Added safe duplicate-account handling, including unique-constraint races.
- Connected the existing login, signup, and user-menu logout controls.
- Added pending, disabled, validation, authentication-error, and registration-success states.
- Added authenticated redirects away from `/login` and `/signup`.
- Added local-only callback validation to prevent open redirects.
- Applied the existing Auth Sprint 1 migration to the configured PostgreSQL database.
- Documented the required `AUTH_SECRET` environment variable.

## Validation

- Prisma schema validation passes.
- TypeScript validation passes.
- ESLint passes.
- Live registration, duplicate registration, validation, login, session, redirect, and logout checks pass.
- The stored test password was confirmed as a bcrypt cost-12 hash without exposing it.
- The session contains the user ID and does not expose the password hash.
- The dedicated smoke-test account was removed after validation.

## Not implemented in this sprint

- Organisation onboarding mutations
- Full protected-route and organisation access enforcement
- Password reset or email verification
- Customer, catalog, quote, or quote-line-item database models

Those business features continue to use the existing mock data.

## Next recommended sprint

Implement organisation onboarding and reusable server-side user, membership, and
role access helpers before protecting the authenticated application routes.
