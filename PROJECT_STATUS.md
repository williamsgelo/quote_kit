# QuoteKit Project Status

## Current sprint

Sprint 8B: Draft quote creation and persistence — complete on `feat/sprint-8b-draft-quotes`.

## Completed

- Replaced the mock Quote list and detail routes with organisation-scoped PostgreSQL reads.
- Added `/quotes/new` and `/quotes/[id]/edit` using the existing application design.
- Added a reusable Quote builder for active Customer selection, active Catalog insertion, custom line items, fractional quantities, discounts, messages, notes, and terms.
- Added structured create/update Server Actions with pending, field-error, and general-error states.
- Added server-side draft creation and editing services.
- Added real Quote totals/counts/recent records to the dashboard.
- Removed the obsolete Quote mock dataset.

## Persistence and transaction strategy

- Draft creation validates all input and tenant-owned references inside a serializable transaction.
- The same transaction snapshots the Customer, calculates canonical totals, atomically reserves the organisation quote number, and creates the Quote with nested QuoteItems.
- A failed create rolls back both records and the number counter.
- Draft edits are organisation-scoped, verify DRAFT status server-side, recalculate all totals, and atomically replace the QuoteItems while preserving the quote number.
- Shared serializable retry handling covers supported transient connection, serialization, write-conflict, and transaction-expiry errors.
- The existing `(organizationId, quoteNumber)` and `(quoteId, position)` database constraints remain final collision/integrity safeguards.

## Pricing and snapshots

- The Sprint 8A Decimal pricing engine remains authoritative; browser totals, status, number, and organisation ID are not submitted as trusted values.
- Money and calculated totals remain `Decimal(19,2)`, tax rates `Decimal(5,2)`, and quantities `Decimal(19,4)`.
- Catalog insertion pre-fills an editable line, and the saved QuoteItem retains those quote-specific values even if Catalog later changes.
- Custom lines persist with `catalogItemId = null` and do not create Catalog records.
- Customer identity/contact/address data is snapshotted on the Quote.
- Existing quote detail renders entirely from persisted snapshots and therefore survives later Customer/Catalog changes or archives.
- An existing draft may retain its currently linked archived Customer or inactive CatalogItem during editing; new unavailable references remain blocked.

## Tenant and status security

- Active organisation identity always comes from the authenticated server session.
- Quote list/detail/edit reads include the trusted `organizationId`.
- Customer and Catalog references are rechecked using ID plus active organisation during each mutation.
- Another tenant's quote returns the same safe not-found behavior as a missing quote.
- Cross-tenant updates throw a safe unavailable error.
- Only DRAFT quotes are editable, enforced by the server service rather than UI visibility.
- New quotes are always DRAFT; no delivery/status-transition workflow was added.

## Database changes

- No Sprint 8B schema change or migration was required.
- Sprint 8B uses the Sprint 8A Quote, QuoteItem, enums, counters, Decimal fields, indexes, and constraints.
- Migration status confirms all four repository migrations are applied.

## Validation

- Prisma validate: passed.
- Prisma Client generation: passed.
- Prisma migration status: database schema is up to date (4 migrations).
- TypeScript validation: passed.
- ESLint: passed with no warnings.
- Unit tests: 30 passed.
- PostgreSQL integration tests: 26 passed, including 7 new Quote persistence/edit/security tests.
- Production build: passed.
- Production start: healthy; `/` and `/login` returned 200.
- Logged-out production route smoke: `/quotes`, `/quotes/new`, Quote detail, and Quote edit redirected to `/login`.
- Automated browser click-through: not run because no controllable browser was attached; authenticated persistence behavior is covered by PostgreSQL integration tests.

## Remaining limitations

- Client-side totals are not previewed while editing; the server-calculated result is shown after save.
- Search returns a sensible capped result set rather than cursor pagination.
- There is no idempotency token for two independent direct create requests; the pending UI prevents accidental double-clicks and transactional numbering prevents corruption.
- Only ZAR is supported by current validation.
- Email delivery, public quote links, VIEWED tracking, accept/decline, activity history, PDF generation, payments, invoices, and permanent deletion remain intentionally unimplemented.
- Full authenticated browser walkthrough should be repeated manually in a signed-in local browser.

## Next recommended sprint

Quote delivery and customer interaction: secure public quote URLs, email delivery, SENT/VIEWED transitions, accept/decline, and activity history. PDF generation may follow once the delivery workflow is stable.
