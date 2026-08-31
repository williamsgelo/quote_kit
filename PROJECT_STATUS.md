# QuoteKit Project Status

## Current sprint

Sprint 10: MVP polish — implementation complete, with manual browser and remote-database regression follow-up noted below.

## MVP polish delivered

- Added the authenticated `/help` route with getting-started steps, Quote status definitions, common questions, expiry guidance, and a configurable support mailto action.
- Connected both Help & Support entry points in the sidebar and user menu to `/help`.
- Removed the placeholder notification control, incorrect Catalog guide link, disabled Customer/Catalog filter buttons, and out-of-scope Quote PDF/duplicate actions.
- Replaced placeholder Settings inputs, fake workspace identifiers, fake plan data, and non-functional branding upload with accurate read-only organisation, account, and current Quote-default information.
- Simplified onboarding to collect only the organisation name that is actually persisted.
- Clarified marketing, login, dashboard, and Quote-list copy so the UI no longer promises demo data, e-signatures, password reset, or draft-only behavior that is not implemented.
- Customer lists now show real organisation-scoped Quote counts, and Customer detail shows the five most recent related Quotes instead of a hardcoded empty state.
- Sent or viewed Quotes past their expiry date display a derived Expired state internally; expired Quotes are excluded from the dashboard's awaiting-response count without changing persisted statuses.
- Quote delivery controls now handle clipboard failure and provide explicit copy/send feedback.
- Public Accept and Decline actions now clearly identify terminal responses, confirm before submission, and retain disabled/loading/error/success states.
- Quote line items render as mobile cards on narrow screens while retaining the existing desktop table.
- Mobile navigation now locks background scrolling, receives initial focus, closes with Escape, and exposes dialog semantics.
- Long customer, organisation, email, item, and monetary values have improved wrapping or tabular alignment in key surfaces.
- The transactional Quote email now has a clearer subject, recognisable business header, labelled total/expiry information, a focused View quote CTA, and an improved plain-text fallback.

## Help and support configuration

- `SUPPORT_EMAIL` optionally controls the contact address shown on `/help`.
- When omitted, the server-only support configuration falls back to the generic QuoteKit support address.
- No support database, ticket system, live chat, CMS, or chatbot was added.

## Architecture and security

- No Prisma schema or migration changes were required.
- Existing Server Components, Server Actions, Auth.js session enforcement, Resend adapter, Decimal pricing engine, and public token architecture remain unchanged.
- Customer Quote counts/history are resolved under an organisation-scoped Customer query.
- Public Quotes remain accessible only through validated public tokens and continue to exclude internal notes.
- Quote financial calculations and persisted status transitions were not changed.

## Validation

- Prisma validate: passed.
- Prisma Client generation: passed with Prisma 7.9.1.
- TypeScript: passed.
- ESLint: passed with no warnings.
- Unit tests: 36 passed.
- Integration tests: sandboxed runs could not reach the configured remote PostgreSQL host and returned Prisma `P1001`; an approved network run remained unresponsive and was stopped. No integration assertion result is claimed.
- Production build: passed and includes `/help` and `/q/[token]`.
- HTTP smoke: `/`, `/login`, and `/signup` returned 200; `/help` and `/dashboard` redirected without authentication; an invalid public token returned 404.
- Browser visual automation: unavailable because no controllable in-app browser was attached to this session.

## Manual pilot checks still required

- Review Landing, Login, Signup, Onboarding, Dashboard, Customers, Catalog, Quotes, Quote detail/builder, Settings, Help, and the public Quote at representative desktop and mobile widths.
- Complete one authenticated create/edit/archive walkthrough for Customers and Catalog.
- Complete one Draft → Edit → Send → Public View → Accept flow and a separate Decline flow against a staging database.
- Confirm the public Quote never exposes internal notes and the activity timeline records one VIEWED event.
- Send one staging email using a verified Resend sender and confirm sender identity, total, expiry, CTA, and plain-text fallback.
- Configure and verify the production `SUPPORT_EMAIL` contact before inviting pilot users.

## Deliberately deferred until after MVP

- PDFs, invoicing, payments, Stripe, AI, e-signatures, inventory, accounting/CRM integrations, team permission expansion, organisation switching, ticketing, live chat, and a knowledge-base CMS.
- Account profile editing, password reset, workspace branding/profile editing, public-link rotation, automated email resend, decline reasons, and automatic expiry jobs.

## Recommended next step

Run the manual desktop/mobile and staging email/database checklist above with the first private-pilot organisation, then address only issues observed in that pilot before starting a post-MVP feature sprint.
