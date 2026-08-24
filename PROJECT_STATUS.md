# QuoteKit Project Status

## Current sprint

Sprint 8A: Quote schema and pricing engine.

## Completed

- Created feature branch `feat/sprint-8a-quote-pricing` from local `main` before application changes.
- Added QuoteStatus and DiscountType Prisma enums for the planned quote workflow.
- Added organisation-owned Quote and QuoteItem models without replacing the existing mock Quote UI.
- Added customer identity, contact, tax, and billing-address snapshots to Quote.
- Added Catalog-independent name, description, unit, quantity, price, tax, and calculated snapshots to QuoteItem.
- Added optional CatalogItem traceability with `SET NULL` deletion behaviour.
- Added organisation-local quote numbering with an atomic counter and database uniqueness constraint.
- Added a shared server-only Decimal pricing engine.
- Added Zod Quote and QuoteItem validation and extracted reusable decimal-string validation used by Catalog and Quotes.
- Added tenant-scoped customer and Catalog snapshot resolution.
- Added a validated draft-preparation service for Sprint 8B without inserting quotes or changing Quote pages.

## Database strategy

- Quote money and calculated line values use PostgreSQL `Decimal(19,2)`.
- Tax rates use `Decimal(5,2)`.
- Quantities use `Decimal(19,4)` for fractional service units.
- New quotes default to DRAFT.
- `(organizationId, quoteNumber)` is unique.
- `(quoteId, position)` is unique for deterministic line ordering.
- Customer deletion is restricted while a Quote references it; organisation deletion cascades; CatalogItem deletion only clears the optional traceability link.
- Migration `20260824155317_quote_schema_pricing` was created, inspected, and applied without resetting existing data.

## Pricing and rounding

- Canonical calculation order is line base, quote discount allocation, tax, then final total.
- Line bases and taxes use Prisma Decimal with `ROUND_HALF_UP` to two currency decimals.
- Percentage discounts are calculated at quote level and allocated proportionally to taxable lines.
- Fixed discounts are rejected when they exceed the subtotal and are allocated proportionally before tax.
- Allocations use integer cents and deterministic largest remainders, with line order as the stable tie-breaker.
- Pricing returns line subtotal, allocated discount, taxable amount, tax, and line total plus all Quote totals as plain decimal strings.
- The pricing engine is deterministic and has no session, database, redirect, numbering, email, or UI dependencies.

## Snapshot and tenant security

- The Customer reference is resolved with both customer ID and trusted active organisation ID.
- Every Catalog reference is resolved with both catalog item ID and trusted active organisation ID.
- Archived Customers and inactive CatalogItems cannot be selected for a new draft.
- Catalog-backed line names, descriptions, units, prices, and tax rates come from PostgreSQL rather than browser values.
- Custom lines are supported with a null CatalogItem reference.
- Persisted Quote and QuoteItem snapshot values remain unchanged after Customer or Catalog edits.
- Cross-organisation Customer and Catalog references return the same safe QuoteReferenceError.

## Quote numbering

- `Organization.nextQuoteNumber` begins at 1.
- The allocator atomically increments the organisation row and returns the number reserved by the current transaction.
- Sprint 8B must call it inside the same transaction that inserts the Quote, so a failed insert rolls the allocation back.
- The database unique constraint is the final collision safeguard.
- Concurrent integration testing allocated unique numbers 1 through 5, while a second organisation independently received 1.

## Validation

- Prisma format: passed.
- Prisma validate: passed.
- Prisma Client generation: passed.
- Quote migration: created, inspected, and applied successfully.
- TypeScript validation: passed.
- ESLint: passed with no warnings.
- Unit tests: 30 passed; 17 new Quote validation and financial tests.
- PostgreSQL integration tests: 19 passed; 5 new Quote model, snapshot, tenancy, custom-line, and numbering tests.
- Migration status: database schema is up to date with all 4 migrations.
- Production build: passed with the existing mock-backed Quote routes unchanged.

## Remaining limitations

- Quote list, detail, and summary pages intentionally remain mock-backed.
- No Quote create/edit Server Actions or UI persistence exist yet.
- Status transition rules beyond the DRAFT default are not implemented.
- Email, public quote pages, PDF generation, activity history, acceptance/decline, payments, and invoicing are not implemented.
- Only ZAR is supported by validation for the current MVP.
- Organisation switching remains future work.

## Next recommended sprint

Sprint 8B: connect the existing Quote builder and pages to organisation-scoped draft creation/editing, use the prepared snapshots and canonical pricing output, allocate the quote number in the creation transaction, and keep all Customer and Catalog references tenant-verified.
