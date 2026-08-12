# QuoteKit Project Status

## Current sprint

Auth Sprint 3: Organisation onboarding.

## Completed

- Preserved and connected the existing onboarding interface.
- Added Zod-validated organisation-name onboarding with structured field and server errors.
- Added server-side authenticated user resolution; no user, organisation, or role identity is accepted from the browser.
- Added transactional organisation and OWNER membership creation.
- Added serializable transaction conflict retries and an in-transaction active-membership check to prevent duplicate onboarding.
- Added deterministic active-organisation resolution using membership creation time and membership ID.
- Added reusable `requireUser()` and `requireOrganization()` server helpers.
- Redirected unauthenticated onboarding visits to login with a safe onboarding callback.
- Redirected onboarded users away from onboarding to the dashboard.
- Added pending and disabled submission states to the existing onboarding form.
- Revalidated onboarding and dashboard routes after successful creation.

## Validation

- Prisma schema validation passes.
- TypeScript validation passes.
- ESLint passes.
- Production build passes.
- Unauthenticated `/onboarding` access redirects to `/login?callbackUrl=%2Fonboarding`.
- An authenticated user without a membership can access the existing onboarding form.
- Empty onboarding data creates no organisation or membership records.
- Empty and whitespace-only organisation names are rejected.
- Valid onboarding creates one organisation and one related OWNER membership.
- Concurrent double submission creates only one organisation and membership.
- A direct repeated creation call returns the existing-onboarding result without creating records.
- An onboarded user visiting `/onboarding` is redirected to `/dashboard`.
- Source inspection confirms only `organizationName` is read from form data; user identity and OWNER role are resolved server-side.
- Active organisation resolution returns the first active membership ordered by creation time and membership ID.
- The disposable smoke-test user and all associated records were removed after validation.

## Not implemented in this sprint

- Full protected-route and organisation access enforcement
- Organisation switching or additional organisation creation
- Password reset or email verification
- Customer, catalog, quote, or quote-line-item database models

Those business features continue to use the existing mock data.

## Next recommended sprint

Auth Sprint 4 should enforce shared authenticated application-route protection,
require an active organisation, and add server-side organisation role helpers.
