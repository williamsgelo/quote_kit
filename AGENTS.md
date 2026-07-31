# QuoteKit Project Context

QuoteKit is a multi-tenant SaaS quotation management platform for businesses that need to create, manage, send, and track professional customer quotations.

The platform allows organisations to manage customers and catalog items, create quotations with line items, calculate totals and taxes, track quote statuses, and manage organisation settings.

## Technology

- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma ORM
- Auth.js
- Tailwind CSS
- shadcn/ui
- Lucide React
- Zod
- React Hook Form

## Project structure

- The project uses the root-level `app/` directory.
- There is no `src/` directory.
- Do not create or move application files into `src/`.
- Public marketing pages are located in `app/(marketing)/`.
- Public authentication pages are located in `app/(auth)/`.
- Authenticated application pages are located in `app/(app)/`.
- Organisation onboarding is located in `app/onboarding/`.
- Prisma schema and migrations live in `prisma/`.
- Generated Prisma Client lives in `generated/prisma/`.
- Shared application components should follow the existing repository conventions.
- Reusable shadcn components should remain in the existing `components/ui/` directory.
- Do not restructure working directories unless required.

## Application routes

### Public routes

- `/` — Landing page
- `/login` — User login
- `/signup` — User registration

### Onboarding

- `/onboarding` — Organisation or business onboarding

### Authenticated application routes

- `/dashboard` — Dashboard overview
- `/customers` — Customer management
- `/catalog` — Product and service catalog
- `/quotes` — Quote management
- `/quotes/[id]` — Quote details
- `/settings` — Organisation and quotation settings

## Architecture rules

- Use Server Components by default for persistent data reads.
- Use Client Components only when browser interactivity is required.
- Use Server Actions for internal form mutations.
- Use Route Handlers only when a real HTTP endpoint is required.
- PostgreSQL is the source of truth for users, organisations, memberships, customers, catalog items, quotes, and quote line items.
- Do not use client-side state as the primary source of truth for database records.
- Do not store authentication state in client-side state.
- Keep temporary UI state local to components where practical.
- Add Zustand only if a clear future requirement justifies it. Do not introduce it prematurely.
- Validate all server-side input with Zod.
- Use React Hook Form for complex interactive forms where appropriate.
- Keep the MVP simple and avoid premature abstractions.
- Do not introduce additional libraries unless they are necessary and compatible with the existing architecture.
- Reuse existing shadcn/ui components before creating custom alternatives.
- Use responsive, accessible components and semantic HTML.
- Maintain the existing UI design system and avoid unnecessary redesigns.

## Multi-tenant organisation rules

- QuoteKit is a multi-tenant application.
- A user may belong to multiple organisations.
- Each organisation has its own isolated business data.
- All organisation-owned records must be associated with an `organizationId`.
- All organisation-owned database queries must be scoped to the authenticated user’s active organisation.
- Never trust an `organizationId` submitted by the browser.
- Resolve the authenticated user from the server-side session.
- Resolve organisation access from the authenticated user’s membership.
- Verify membership before allowing access to organisation data.
- Never allow users to access, modify, or delete records belonging to an organisation they are not a member of.
- For the MVP, automatically use the user’s first active organisation.
- Organisation switching can be added later without requiring major architectural changes.
- Do not expose organisation access logic only through client-side checks.

## Authentication and access rules

- Use Auth.js for authentication.
- Authentication must be enforced server-side.
- Unauthenticated users attempting to access application routes must be redirected to `/login`.
- Authenticated users without an organisation must be redirected to `/onboarding`.
- Authenticated users with an active organisation may access the application.
- Do not trust user IDs submitted by the browser.
- Derive user identity from the authenticated server-side session.
- Keep authentication and database logic server-only.
- Never expose authentication secrets or sensitive environment variables to the client.

## Organisation membership roles

QuoteKit supports the following MVP roles:

- `OWNER`
- `ADMIN`
- `MEMBER`

### Role responsibilities

#### OWNER

- Full access to the organisation
- Manage organisation settings
- Manage organisation members
- Manage customers
- Manage catalog items
- Create, edit, send, and manage quotes

#### ADMIN

- Manage customers
- Manage catalog items
- Create, edit, send, and manage quotes
- Access relevant organisation settings
- Cannot perform owner-only organisation actions

#### MEMBER

- Access the organisation according to future permissions
- May view or work with customers, catalog items, and quotes where permitted
- Must not receive owner or administrator privileges by default

Role permissions should be enforced server-side.

Do not rely only on hidden buttons or client-side UI checks for authorisation.

## Organisation access helpers

Keep reusable server-side access helpers for:

- `requireUser()`
- `requireOrganization()`
- `requireOrganizationRole()`
- `assertOrganizationAccess()`

These helpers should follow the existing project conventions.

### `requireUser()`

- Retrieve the authenticated user from the server-side session.
- Reject or redirect unauthenticated users.
- Return the authenticated user.

### `requireOrganization()`

- Retrieve the authenticated user.
- Resolve the user’s active organisation through their membership.
- Return the organisation and membership information.
- Handle users who have not completed onboarding.

### `requireOrganizationRole()`

- Verify that the authenticated user has one of the required organisation roles.
- Reject unauthorised access server-side.

### `assertOrganizationAccess()`

- Verify that the authenticated user belongs to the requested organisation.
- Never accept an organisation ID as trusted without verifying membership.

## Core Prisma models

The application is expected to use the following core models as development progresses:

### Authentication

- `User`
- `Account`
- `Session`
- `VerificationToken`

### Multi-tenancy

- `Organization`
- `Membership`

### Business data

- `Customer`
- `CatalogItem`
- `Quote`
- `QuoteItem`

Additional models should only be introduced when required by a defined feature.

## Core data relationships

- A `User` may belong to multiple organisations through `Membership`.
- An `Organization` may have multiple users through `Membership`.
- An `Organization` has many customers.
- An `Organization` has many catalog items.
- An `Organization` has many quotes.
- A `Customer` belongs to one organisation.
- A `Customer` may have many quotes.
- A `CatalogItem` belongs to one organisation.
- A `Quote` belongs to one organisation.
- A `Quote` belongs to one customer.
- A `Quote` contains multiple quote line items.
- Each `QuoteItem` belongs to one quote.
- Quote line items should preserve their own name, description, quantity, unit price, and calculated totals so historical quotes are not changed when catalog items are updated later.

## Main QuoteKit workflow

1. A user signs up or signs in.
2. A new user creates an organisation during onboarding.
3. The organisation is created.
4. An `OWNER` membership is created for the user.
5. The user is redirected to the dashboard.
6. An owner or admin creates customers.
7. An owner or admin creates products or services in the catalog.
8. An owner or admin creates a quote for a customer.
9. Catalog items can be added to the quote as line items.
10. Quote totals, tax, and final amounts are calculated.
11. The quote is saved as a draft.
12. The quote can be updated and sent.
13. Quote status is tracked.
14. The organisation can review and manage its quotes.

## Quote statuses

Use the following MVP quote statuses:

- `DRAFT`
- `SENT`
- `VIEWED`
- `ACCEPTED`
- `REJECTED`
- `EXPIRED`

Status transitions should be controlled by server-side business logic when quote functionality is implemented.

## Quote data rules

- Quotes must always belong to an organisation.
- Quotes must always be scoped to the authenticated user’s active organisation.
- Customers selected for a quote must belong to the active organisation.
- Catalog items selected for a quote must belong to the active organisation.
- Never trust customer IDs, catalog item IDs, or quote IDs from the browser without verifying organisation ownership.
- Quote line items should store historical snapshots of relevant catalog information.
- Use decimal-safe database types for money.
- Do not use JavaScript floating-point arithmetic as the source of truth for persisted monetary values.
- Calculate quote totals consistently on the server.
- Validate all quote input with Zod.
- Do not allow users to modify quotes belonging to another organisation.

## Customer rules

- Every customer belongs to one organisation.
- Customer queries must always be scoped to the active organisation.
- Customers must not be accessible across organisations.
- Validate customer creation and update input with Zod.
- Use Server Actions for internal customer mutations.
- Support customer loading, empty, error, and success states.

## Catalog rules

- Every catalog item belongs to one organisation.
- Catalog items may represent products or services.
- Catalog queries must always be scoped to the active organisation.
- Catalog items must not be accessible across organisations.
- Validate catalog item input with Zod.
- Use decimal-safe values for prices.
- Use Server Actions for internal catalog mutations.
- Existing quotes must retain historical line-item values when catalog items are changed.

## UI rules

- Use shadcn/ui components where appropriate.
- Use Lucide React for icons.
- Maintain the existing QuoteKit UI and design conventions.
- Do not replace completed UI unnecessarily.
- Keep application pages responsive across desktop, tablet, and mobile.
- Use accessible labels, keyboard-friendly controls, and semantic HTML.
- Include loading, empty, error, disabled, and success states where relevant.
- Use consistent spacing, typography, borders, and component behaviour.
- Avoid unnecessary gradients, decorative effects, or over-engineered animations.
- Keep the interface clean and practical for business quotation management.

## Development requirements

After each sprint:

- Run Prisma formatting if the schema changed.
- Run Prisma validation if the schema changed.
- Run Prisma Client generation if the schema changed.
- Create and apply the required migration if the schema changed.
- Run TypeScript checking or the project’s configured type validation.
- Run linting.
- Run the production build when practical.
- Fix errors introduced by the current sprint.
- Do not modify unrelated working code without a clear reason.
- Update `PROJECT_STATUS.md`.
- Remove temporary mock data when real database functionality replaces it.
- Keep mock data only where the related backend feature has not yet been implemented.
- Update the README when setup, environment variables, database requirements, or development workflows change.
- Update `.env.example` when new environment variables are required.
- Clearly report any pre-existing errors that were not caused by the current work.

## Completion report

At the end of every task or sprint, provide:

- Summary of completed work
- Files created
- Files changed
- Database schema changes
- Migration changes
- Environment variables added or changed
- Server Actions or Route Handlers added
- Validation commands run
- Validation results
- Manual test steps
- Remaining limitations or risks
- Recommended next development step
