# QuoteKit Project Status

## Current sprint

Auth Sprint 1: Prisma and authentication database foundation.

## Completed

- Preserved the existing root-level App Router UI and mock-data flows.
- Configured Prisma 7 for PostgreSQL.
- Added Auth.js-compatible `User`, `Account`, `Session`, and `VerificationToken` models.
- Added `Organization` and `Membership` tenancy models with role-based membership constraints.
- Added a nullable `User.passwordHash`; no plaintext password field or hashing behavior exists.
- Added a server-only Prisma client backed by the Prisma PostgreSQL driver adapter and protected against development hot-reload connection churn.
- Documented the required `DATABASE_URL` setup.
- Created the initial `20260731163000_auth_foundation` PostgreSQL migration.
- Prisma formatting, schema validation, client generation, TypeScript validation, and linting pass.

## Current blockers

- Migration deployment is pending because `DATABASE_URL` is not configured in the local environment.
- The sandboxed production build could not fetch the existing Geist font files from Google Fonts; run `npm run build` in a network-enabled environment.

## Not implemented in this sprint

- Registration and password hashing
- Credentials login and Auth.js configuration
- Organisation onboarding mutations
- Protected-route enforcement
- Customers, catalog items, quotes, and quote line item database models

Those business features continue to use the existing mock data until their dedicated backend sprints.

## Next recommended sprint

Auth Sprint 2 should configure Auth.js credentials authentication, add Zod-validated registration and login Server Actions, hash passwords securely, and create reusable server-side user and organisation access helpers without redesigning the existing forms.
