# QuoteKit Project Status

## Current sprint

Sprint 6: Customer backend and CRUD.

## Completed

- Added the organisation-owned Customer Prisma model and applied the `20260814095219_customer_backend` migration.
- Added customer name, company, contact, tax, address, notes, archive, and timestamp fields with organisation and active-list indexes.
- Replaced the customer list mock data with PostgreSQL reads scoped to the authenticated active organisation.
- Added server-side customer search across name, company, email, and phone.
- Added customer create, detail, edit, and soft-archive routes while preserving the existing application design system.
- Added shared Zod validation with trimming, email normalisation, optional empty-string normalisation, phone validation, and field length limits.
- Added server-only customer query and mutation services so pages remain thin and tenant behaviour is directly integration tested.
- Added structured create, update, and archive Server Actions with pending states, field errors, general errors, route revalidation, and safe redirects.
- Added safe not-found handling for both missing and cross-organisation customer IDs.
- Removed the obsolete customer mock array; Catalog and Quotes remain mock-data features.

## Tenant security

- The active organisation is derived from the authenticated server session for every page and action.
- No customer form accepts `organizationId`, user ID, membership role, or archive state.
- Customer detail reads use both customer ID and active organisation ID.
- Updates and archives use `updateMany` constrained by customer ID, organisation ID, and active state.
- Cross-organisation reads, updates, and archives return the same unavailable result without revealing record existence.
- Archive is a soft update to `isArchived = true`; normal lists and searches exclude archived customers.

## Validation

- Prisma format: passed.
- Prisma validate: passed.
- Prisma Client generation: passed.
- Customer migration: created and applied successfully.
- TypeScript validation: passed.
- ESLint: passed with no warnings.
- Unit tests: 9 passed, including customer normalisation and invalid input.
- PostgreSQL integration tests: 9 passed, including customer create, search, update, archive, and tenant isolation.
- Production build: passed with all customer routes dynamically server-rendered.
- Authenticated production-route smoke test: passed for login redirect, customer list, create form, search empty state, and safe missing-customer rendering.
- Interactive browser CRUD validation: not available in this session because no browser instance was connected; mutation behaviour is covered by the PostgreSQL integration suite.

## Remaining limitations

- Customer pagination is not implemented because the existing UI did not include pagination; the MVP list is capped at 100 active records.
- Archived-customer browsing and restore are not implemented.
- Quote counts and quote history remain empty until the Quote backend exists.
- Catalog and Quotes continue using mock data.
- Organisation switching, password reset, email verification, MFA, and rate limiting remain future work.

## Next recommended sprint

Implement the Catalog backend and organisation-scoped CRUD foundation, including decimal-safe pricing, product/service validation, archive behaviour, tenant-isolation tests, and integration with the existing Catalog UI.
