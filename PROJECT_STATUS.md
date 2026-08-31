# QuoteKit Project Status

## Current sprint

Sprint 11: Technical and on-page launch SEO — implementation complete.

## SEO audit baseline

- The root-level App Router contained one public marketing page (`/`), public authentication pages, protected onboarding/application routes, one authenticated Help page, an Auth.js API route, and secure public `/q/[token]` Quote pages.
- Before this sprint, only the root layout exported basic title and description metadata.
- The homepage had one abstract H1 and three H2 sections, but no canonical, robots directive, Open Graph/Twitter metadata, or structured data.
- `robots.txt` and `sitemap.xml` returned 404.
- Authentication, application, onboarding, and customer Quote routes had no explicit page/layout noindex metadata.
- The favicon was the placeholder Vercel triangle and there was no branded social image.

## Indexation strategy

- `/` is the only indexable route and the only sitemap entry.
- `/login` and `/signup` are public but explicitly `noindex, nofollow`.
- `/onboarding` and the shared authenticated application layout are explicitly `noindex, nofollow`.
- `/help` remains authenticated and noindex; it was not moved or duplicated as a public marketing page.
- Every `/q/[token]` customer Quote inherits `noindex, nofollow`; tokens are never included in the sitemap.
- Auth/API and protected application paths are excluded from crawl queues in `robots.txt`; access control continues to be enforced by Auth.js and server-side organisation helpers.

## Homepage SEO delivered

- Final title: `Online Quote Tool for Small Businesses | QuoteKit`.
- Final description: `Create professional quotes, send them online, track when customers view them, and get approvals faster with QuoteKit.`
- Final H1: `Create Professional Quotes Online in Minutes`.
- Expanded human-first content around online quotations, customers, reusable services, quantities, prices, tax, discounts, secure sending, views, accept/decline responses, and status tracking.
- Added logical H2/H3 sections for product capabilities, the four-step workflow, service-business use cases, visible questions, and the closing call to action.
- Added natural South African relevance through ZAR-compatible product copy without creating thin local doorway pages.
- Removed unsupported pricing/cancellation claims and the misleading Pricing navigation anchor.
- Kept login/signup links crawlable and stopped the homepage from linking its login CTA through a protected application URL.
- The marketing page remains a Server Component and adds no client-side state or image payload.

## Technical SEO delivered

- Added validated site-origin configuration using `APP_URL`, with `https://quotevia.co.za` as the canonical fallback.
- Added `metadataBase`, title defaults/template, description, application name, index/follow defaults, icons, Open Graph, and Twitter metadata.
- Added a self-referencing homepage canonical.
- Added `app/robots.ts` with the canonical host, sitemap reference, and scoped crawl exclusions.
- Added `app/sitemap.ts` containing only `https://quotevia.co.za/`.
- Added `X-Robots-Tag: noindex, nofollow` response headers for Auth/API and secure Quote paths.
- Added a permanent `www.quotevia.co.za` to `quotevia.co.za` redirect when the request reaches the application on the www host.
- Added accurate WebSite and SoftwareApplication JSON-LD without offers, prices, ratings, reviews, or other fabricated properties.
- FAQ structured data was intentionally omitted; the FAQ remains visible content, but QuoteKit is not eligible for Google's limited FAQ rich-result treatment.
- Replaced the placeholder favicon with a branded SVG icon and added a generated Apple touch icon.
- Added a 1200×630 branded Open Graph image reused for Twitter cards.

## Architecture and database

- No Prisma schema or migration changes were required.
- No Server Actions, Route Handlers, authentication logic, tenant access, Quote business logic, or database queries were changed.
- No dependencies or environment variables were added.
- `APP_URL` documentation now states that production must use `https://quotevia.co.za` because it drives secure Quote links and canonical metadata.

## Validation

- TypeScript: passed.
- ESLint: passed with no warnings.
- Unit tests: 36 passed.
- Integration tests: the sandboxed aggregate run could not connect to PostgreSQL; the approved network retry passed all 34 integration tests.
- Production build: passed; `/`, `/apple-icon`, `/icon.svg`, `/opengraph-image`, `/robots.txt`, and `/sitemap.xml` are statically generated.
- Production homepage HTML: one H1; correct title, description, canonical, index/follow, Open Graph, Twitter, and syntactically valid JSON-LD.
- `/login` and `/signup`: rendered `noindex, nofollow`.
- Invalid `/q/[token]`: returned 404 and rendered the shared Quote-route noindex metadata.
- `/dashboard`: continued to redirect unauthenticated requests to `/login`; the authenticated layout contains the shared noindex metadata.
- `robots.txt`: returned 200 and referenced `https://quotevia.co.za/sitemap.xml`.
- `sitemap.xml`: returned 200 and contained only `https://quotevia.co.za/`.
- Branded SVG, Apple icon, and Open Graph image routes returned 200 with correct content types; the Open Graph image received visual inspection.
- In-app browser visual automation was unavailable because no controllable browser was attached; rendered production HTML and generated image output were inspected directly.

## Launch checks still required

- Confirm Vercel production `APP_URL` is exactly `https://quotevia.co.za`.
- Confirm the www hostname reaches Vercel so the application redirect can enforce the non-www origin, and redirect or restrict any public Vercel deployment alias in hosting configuration.
- Review the homepage at representative mobile, tablet, and desktop widths in a real browser.
- Validate the deployed URL with Schema.org Validator, Google Rich Results Test, and social sharing debuggers after DNS is live.
- Verify the domain in Google Search Console, submit the sitemap, inspect the homepage, request indexing, and monitor Google's selected canonical, coverage, search queries, and Core Web Vitals.

## Future organic content opportunities

- Commercial: online quote tool, quotation software, and quote software for small businesses.
- Use cases: quoting software for freelancers, agencies, contractors, trades, and cleaning businesses.
- South Africa: quotation software South Africa, online quote maker South Africa, and small-business quotation software South Africa.
- Educational: how to create a professional quote, quote vs invoice, what a quotation should include, and how long a quote should remain valid.
- Build only substantial resources that solve a real search need; do not create thin keyword-variant pages or a blog until there is a sustainable publishing plan.

## Recommended next step

Deploy to the custom domain, complete the Search Console and production-browser checklist, then use early query/impression data to prioritise the first substantive commercial or educational resource.
