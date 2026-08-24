# QuoteKit Project Status

## Current sprint

Sprint 7: Services Catalog backend.

## Completed

- Added the organisation-owned CatalogItem Prisma model and applied the `20260814151111_catalog_backend` migration.
- Added reusable item name, description, optional SKU, unit, exact unit-price and tax-rate decimals, active state, and timestamps.
- Added organisation, active-list, name, and SKU indexes.
- Replaced Catalog mock data with PostgreSQL reads scoped to the authenticated active organisation.
- Added server-side catalog search across name, description, and SKU.
- Added catalog create and edit routes plus soft archive while retaining the existing application design.
- Added shared Zod validation for item details, supported units, optional SKU, non-negative prices, tax bounds, and exact two-decimal normalisation.
- Added shared money formatting and exact decimal-bound utilities; Quote UI remains mock-backed but now reuses the formatter.
- Added server-only catalog query and mutation services and structured Server Actions with field errors, general errors, pending states, and route revalidation.
- Added safe unavailable handling for missing, inactive, and cross-organisation catalog item IDs.
- Removed the obsolete catalog mock array. Quotes remain a mock-data feature.

## Money strategy

- Unit prices are stored as PostgreSQL `Decimal(19,2)` and tax rates as `Decimal(5,2)`.
- Server validation accepts decimal strings only, allows at most two fractional digits, and checks bounds with integer-safe string conversion rather than JavaScript floating-point arithmetic.
- Validated strings are converted to Prisma Decimal only inside the server-only catalog service.
- Number conversion is limited to UI currency formatting and is not used as the canonical persisted value or for server calculations.

## Tenant security

- Every page and Server Action derives the active organisation from the authenticated server session.
- Catalog forms do not accept `organizationId`, user ID, membership role, or `isActive`.
- Catalog reads combine catalog item ID with active organisation ID.
- Updates and archives use `updateMany` constrained by catalog item ID, organisation ID, and active state.
- Cross-organisation reads, updates, and archives fail with the same unavailable result and do not reveal record existence.
- Archive is a soft update to `isActive = false`; active lists and search exclude archived items.

## Validation

- Prisma format: passed.
- Prisma validate: passed.
- Prisma Client generation: passed.
- Catalog migration: created and applied successfully.
- TypeScript validation: passed.
- Unit tests: 13 passed, including catalog validation and exact decimal bounds.
- PostgreSQL integration tests: 14 passed, including catalog create, search, update, archive, exact decimal persistence, and tenant isolation.
- ESLint: passed with no warnings.
- Production build: passed after replacing the build-time Google Fonts dependency with a local system-font stack.
- Interactive browser CRUD validation: pending; automated mutation and tenant behaviour is covered by the PostgreSQL integration suite.

## Remaining limitations

- Catalog pagination is not implemented because the existing UI did not include pagination; the MVP list is capped at 100 active records.
- Archived-item browsing and restore are not implemented.
- The supported unit list is intentionally fixed for the MVP.
- Organisation switching remains future work.
- Quotes remain mock-backed; no quote, quote-item, total, or status persistence was added.

## Next recommended sprint

Implement the Quote backend and CRUD foundation, including organisation-scoped customers and catalog selections, immutable line-item snapshots, decimal-safe totals and tax calculations, status rules, and tenant-isolation tests.
