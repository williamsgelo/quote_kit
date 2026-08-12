# QuoteKit Project Status

## Current sprint

Auth Sprint 4: Server-side tenant access and protected application routes.

## Completed

- Added reusable server-only `requireUser()`, `requireOrganization()`, `requireOrganizationRole()`, and `assertOrganizationAccess()` helpers.
- Added explicit redirecting page guards and throwing action/API authorization behavior.
- Verified session users against PostgreSQL and return only safe user fields.
- Protected dashboard, customer, catalog, quote, and settings routes once through the shared server application layout.
- Kept active-organisation selection deterministic through the first active membership ordered by creation time and membership ID.
- Added explicit-list role authorization for OWNER, ADMIN, and MEMBER roles without implicit hierarchy.
- Added cross-tenant membership verification using both the authenticated user ID and requested organisation ID.
- Connected authenticated user and active organisation data to the existing application shell, user menu, and display-only organisation switcher.
- Updated login and signup redirects for authenticated users with and without active memberships.
- Added bounded retries for transient hosted PostgreSQL connection closures on access-control reads.
- Kept middleware absent; the shared server layout and server-only helpers remain the security boundary.

## Validation

- Prisma schema validation passes.
- TypeScript validation passes.
- ESLint passes.
- Production build passes.
- Unauthenticated `/onboarding` access redirects to `/login?callbackUrl=%2Fonboarding`.
- An authenticated user without a membership can access the existing onboarding form.
- Logged-out visits to all five protected route groups redirect to `/login`.
- Authenticated users without an active organisation redirect to `/onboarding`.
- Active members can access all protected route groups.
- Login and signup redirect authenticated users to onboarding or dashboard according to membership state.
- Onboarded users visiting onboarding redirect to the dashboard.
- Cross-tenant organisation IDs are rejected; own-organisation access returns minimal membership details.
- OWNER and ADMIN explicit role checks pass; MEMBER is rejected from an owner-only operation.
- Inactive organisations are not selected and deleted-user sessions redirect to login.
- Public landing, login, and signup routes remain accessible without a session.
- The shell displays the authenticated user and active organisation without exposing other memberships.
- Disposable test users, organisations, memberships, and test routes were removed after validation.

## Not implemented in this sprint

- Organisation switching or additional organisation creation
- Feature-specific role policies and CRUD authorization
- Password reset or email verification
- Customer, catalog, quote, or quote-line-item database models

Those business features continue to use the existing mock data.

## Next recommended sprint

Implement the first organisation-scoped business-data feature, applying the
shared access helpers to every server read and mutation.
