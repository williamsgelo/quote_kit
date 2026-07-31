# QuoteKit

QuoteKit is a multi-tenant SaaS quotation platform built with the Next.js App Router, TypeScript, PostgreSQL, Prisma, Auth.js, Tailwind CSS, and shadcn/ui.

## Local setup

1. Install dependencies with npm:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and replace its placeholder with a PostgreSQL connection string:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
   ```

3. Generate the Prisma client and apply migrations:

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Project structure

- `app/` contains all App Router routes at the repository root.
- `components/` contains application, shared, and shadcn UI components.
- `lib/` contains shared utilities and server-only infrastructure.
- `prisma/` contains the Prisma schema and migrations.
- `generated/prisma/` contains the generated Prisma Client and should not be edited manually.

Authentication forms and organisation onboarding are currently UI-only. Auth.js behavior and mutations will be connected in a later authentication sprint.
