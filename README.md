# QuoteVia

QuoteVia is a multi-tenant SaaS quotation platform built with the Next.js App Router, TypeScript, PostgreSQL, Prisma, Auth.js, Tailwind CSS, and shadcn/ui.

## Requirements

- Node.js 20.19 or newer (Node.js 22 LTS is recommended)
- npm, using the committed `package-lock.json`
- PostgreSQL with permission to create and migrate the development schema

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and replace its placeholders.

3. Set `DATABASE_URL` to a PostgreSQL connection string. If the provider requires TLS, use the provider's documented parameters; `sslmode=verify-full` preserves strict certificate and host verification.

4. Generate a unique Auth.js secret:

   ```bash
   npx auth secret
   ```

`DATABASE_URL` and `AUTH_SECRET` are required. `AUTH_URL` is optional when Auth.js cannot correctly infer the public deployment origin. Quote delivery additionally requires a trusted `APP_URL`, `RESEND_API_KEY`, and verified `EMAIL_FROM`. `SUPPORT_EMAIL` optionally configures the mailto contact shown on the Help & Support page. `APP_URL` is server-only and supplies both secure Quote links and the canonical SEO origin; production must set it to `https://quotevia.co.za`. QuoteVia explicitly trusts the host received by its Next.js server, so production infrastructure must reject arbitrary Host headers and supply the canonical public host. Seed variables are development-only and must not be set in production.

## Prisma and database

```bash
npx prisma format                  # Format the schema
npx prisma validate                # Validate the schema and config
npx prisma generate                # Generate generated/prisma
npx prisma migrate dev --name name # Create and apply a development migration
npx prisma migrate deploy          # Apply committed migrations in production
npx prisma migrate status          # Check migration state
npx prisma studio                  # Inspect local data
npm run prisma:seed                # Create the minimal development seed
```

Prisma 7 runs seeds only when `prisma db seed` is invoked explicitly. Before seeding, replace all `SEED_*` placeholders in `.env`. The seed refuses to run with `NODE_ENV=production`, hashes its password with bcrypt cost 12, and idempotently creates one development user, one organisation, and one OWNER membership. It does not create customers, catalog items, or quotes.

## Development and validation

```bash
npm run dev              # Development server
npm run typecheck        # TypeScript validation
npm run lint             # ESLint
npm run test:unit        # Database-independent auth tests
npm run test:integration # PostgreSQL-backed auth and tenancy tests
npm test                 # All automated tests
npm run build            # Production build
npm start                # Serve the production build locally
```

Open [http://localhost:3000](http://localhost:3000). Integration tests require a migrated test or development database and create uniquely named records that are removed after the run. Playwright is not configured, so browser-flow validation is currently manual.

## Authentication testing

1. Register a new account at `/signup` and confirm its `passwordHash` starts with a bcrypt marker such as `$2b$`; never print or copy the full hash.
2. Log in with the new credentials and confirm the user is sent to `/onboarding`.
3. Create an organisation and confirm exactly one Organization and one OWNER Membership reference the authenticated user.
4. Confirm `/dashboard` renders the authenticated user's safe details and active organisation name.
5. Sign out and confirm a protected URL such as `/dashboard` redirects to `/login`.
6. Log back in and confirm the existing membership sends the user directly to the dashboard.

The shared server application layout protects `/dashboard`, `/customers`, `/catalog`, `/quotes`, `/settings`, and `/help`. Active organisation selection uses the authenticated user's first active membership ordered by membership creation time and ID. Browser-provided user IDs, roles, and organisation IDs are never trusted.

## Launch SEO

The homepage is the only route included in `sitemap.xml`. It has a self-referencing canonical on `https://quotevia.co.za/`, index/follow metadata, Open Graph and Twitter metadata, and linked Organization, WebSite, WebPage, and SoftwareApplication JSON-LD. The Organization node identifies the online business and its crawlable logo without claiming an unverified physical location, opening hours, reviews, or ratings. `robots.txt` references the sitemap and keeps API and authenticated application paths out of crawl queues. API and secure Quote responses also receive `X-Robots-Tag: noindex, nofollow`, and requests reaching the app on `www.quotevia.co.za` permanently redirect to the canonical non-www origin.

Authentication, onboarding, authenticated application layouts, and `/q/[token]` use page or shared-layout `noindex, nofollow` metadata. Secure customer Quote URLs are never added to the sitemap. The authenticated `/help` page is intentionally noindex until a separate public help resource exists.

Google Tag Manager container `GTM-NNNSRZSB` is installed directly in the root layout without an analytics dependency. The bootstrap script is rendered in the document head and the required noscript iframe is the first element inside the body, so the container is available across marketing, authentication, application, and public Quote routes.

## Customer management

Customers are persisted in PostgreSQL and always belong to one organisation. The `/customers` routes support active-customer listing, server-side search, create, detail, edit, and soft archive. Archived records are excluded from the normal list but retained for future historical quote relationships.

Customer pages resolve the active organisation from the authenticated server session. Customer IDs from route parameters are always queried together with that organisation ID; a missing or cross-organisation record returns the same not-found response. Customer mutations use Server Actions with shared Zod validation and never accept an organisation ID from the browser.

## Catalog management

Catalog items are persisted in PostgreSQL and scoped to the active organisation. The `/catalog` routes support active-item listing, server-side search, create, edit, and soft archive. Archived items remain stored for future historical quote relationships but are excluded from the normal catalog list and future quote selectors.

Unit prices use PostgreSQL `Decimal(19,2)` and tax rates use `Decimal(5,2)`. Form values are validated and normalised as decimal strings before conversion to Prisma Decimal values; persisted financial values never use JavaScript floating-point numbers as their source of truth. Catalog mutations never accept an organisation ID or active state from the browser, and record reads, updates, and archives are constrained by the server-derived active organisation.

## Draft quote management

Quotes and QuoteItems are persisted in PostgreSQL. The `/quotes` routes provide organisation-scoped list/search, draft creation, detail, and DRAFT-only editing. New quote forms load active Customers and CatalogItems from the current organisation and also support custom lines with no Catalog relation. Archived Customers and inactive CatalogItems are unavailable for new quotes.

Customer identity/address fields and every commercial line value are copied onto the Quote at save time. A Catalog reference is optional traceability only: users may customise the copied line without changing Catalog, and later Customer or Catalog changes do not mutate the persisted Quote snapshot. An existing draft may retain its currently linked archived Customer or inactive CatalogItem while editing, but cannot introduce a different unavailable record.

Quote money uses PostgreSQL `Decimal(19,2)`, tax rates use `Decimal(5,2)`, and quantities use `Decimal(19,4)`. The shared server-only pricing engine calculates `line base → proportional quote discount → tax → final total` with Decimal `ROUND_HALF_UP`. Percentage and fixed discounts are allocated to lines before tax. Integer-cent largest-remainder allocation ensures fixed discounts remain exact across mixed tax rates without binary floating-point arithmetic.

Each organisation owns an atomic `nextQuoteNumber` counter. Draft creation validates tenant-owned references, calculates totals, reserves the number, and creates the Quote plus QuoteItems in one serializable transaction. Failed writes roll back the counter, and the `organizationId + quoteNumber` database constraint is the final collision safeguard. Edits replace line items atomically and preserve the original quote number.

Browser-submitted organisation IDs, quote numbers, statuses, and totals are ignored. Server Actions resolve the active organisation from the authenticated session, validate Customer and Catalog ownership again, run the canonical pricing engine, and persist only server-calculated totals. Non-DRAFT and cross-organisation updates are rejected server-side.

## Quote delivery and public responses

A DRAFT Quote with a Customer email address can be sent from its internal detail page. QuoteVia generates one cryptographically secure 256-bit base64url token and sends a simple transactional email through the Resend HTTP API. Public links use `/q/<token>` and contain no quote number, database ID, user ID, or organisation ID. Configure and verify the `EMAIL_FROM` sender in Resend before testing delivery.

The public page is available without an account and renders persisted Quote/QuoteItem snapshots, the customer-visible message, and terms. It never selects or renders internal notes, membership data, or authentication data. First access records one VIEWED activity and timestamp; refreshes are idempotent. The internal link owner opening the link also counts as the first view for this MVP.

Server-side transitions allow `DRAFT → SENT`, `SENT → VIEWED`, and `SENT/VIEWED → ACCEPTED` or `DECLINED`. ACCEPTED and DECLINED are terminal through the public interface and repeated same responses do not create duplicate activity. Expiry is derived at request time after the end of `expiryDate`: expired Quotes remain historically readable, acceptance is blocked, and no scheduler or automatic EXPIRED database update is used.

Email is attempted before SENT is persisted. A provider/configuration failure returns an error and leaves the Quote DRAFT with no SENT timestamp or activity. The secure token may already have been allocated for a failed attempt, but DRAFT tokens do not resolve publicly; retrying reuses the same token. The internal detail page exposes copy/open controls after successful delivery.

The dashboard conversion rate is `accepted / (accepted + declined)`. SENT and VIEWED Quotes are undecided and are not counted as failed conversions.

## Troubleshooting

- **Incorrect host or origin:** set `AUTH_URL` when the deployment origin cannot be inferred. Ensure the reverse proxy rejects arbitrary Host headers and forwards only the canonical public host.
- **Incorrect callback or deployment URL:** ensure `AUTH_URL` matches the public origin and protocol; do not include an unrelated path.
- **MissingSecret:** set a stable, strong `AUTH_SECRET`. Changing it invalidates existing JWT session cookies, so clear stale cookies and sign in again.
- **Prisma client import or generation error:** run `npx prisma generate` and confirm generated files exist under `generated/prisma/`.
- **Missing table or migration:** run `npx prisma migrate status`, then `npx prisma migrate dev` locally or `npx prisma migrate deploy` in production.
- **PostgreSQL connection failure:** check credentials, host access, provider TLS requirements, and whether the database accepts connections from the current environment.
- **Quote email is not configured:** set `APP_URL`, `RESEND_API_KEY`, and `EMAIL_FROM`; use a sender/domain verified by Resend. Local `APP_URL` may use HTTP, while production requires HTTPS.
- **Resend rejects a request:** confirm the API key is active, the sender is verified, and the Customer snapshot contains a valid deliverable email address. A failed request leaves the Quote DRAFT so it can be retried safely.
- **bcrypt native module error:** use a supported Node.js version and reinstall dependencies for the current OS/architecture so the native package can rebuild.
- **Redirect loop between onboarding and dashboard:** verify the session user still exists and has a Membership whose Organization is active.

## Project structure

- `app/` contains root-level App Router routes and route groups.
- `components/` contains application, shared, and shadcn UI components.
- `lib/` contains validation, authentication, tenant-access, and server-only infrastructure.
- `prisma/` contains the schema, migrations, and development seed.
- `generated/prisma/` contains generated Prisma Client code and must not be edited manually.
- `tests/` contains focused Node test-runner unit and PostgreSQL integration coverage.
