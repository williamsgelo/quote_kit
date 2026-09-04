# QuoteVia Project Status

## Latest update

- Added `/free-quotation-template` as a genuinely useful public acquisition resource available without signup.
- Added a complete locally editable quotation structure covering business, customer, dates, line items, totals, notes, terms, and acceptance.
- Added native browser Print / Save as PDF behavior with A4 print CSS and explicit confirmation that QuoteVia does not submit, upload, or persist template content.
- Linked the resource into the existing public acquisition cluster and added it to the sitemap.

## Current sprint

Sprint 13: Free quotation template acquisition resource — implementation complete.

## Free quotation template

- `/free-quotation-template` targets free, professional, small-business, and South African quotation-template intent with unique Metadata API title, description, canonical, Open Graph, and Twitter fields.
- The resource delivers the editable template before any product conversion content and requires no QuoteVia account.
- Highlighted content-editable fields work locally in the browser without React state, form submission, database writes, or storage.
- The template includes business and optional company details, quote reference and dates, customer contact and address, three editable line items, subtotal, discount, tax/VAT, total, notes, terms, and written/signature acceptance guidance.
- Visitors manually enter their own prices and totals. The page clearly distinguishes this resource from a future quotation generator.
- A minimal Client Component invokes the native browser print dialog; print CSS hides navigation, educational content, and CTAs so only the quotation document prints or saves to PDF.
- Educational content covers essential quotation information, practical 7/14/30-day validity considerations, non-advisory tax/VAT guidance, and quotation-versus-invoice differences.
- Product conversion appears after the template and guidance, explaining when QuoteVia can replace repeated document work with online sending, view tracking, and accept/decline responses.
- The page links naturally to the homepage, online quote maker, and South African quotation software pages. A code-level resource-list location is reserved for `/free-quotation-generator`, but no link is emitted before that route exists.
- FAQ structured data was not added because QuoteVia is not an authoritative government or health site eligible for regular Google FAQ rich results. No new or fabricated schema was added.
- No database schema, migration, Quote record, pricing logic, authentication, customer workflow, Server Action, Route Handler, dependency, or environment variable changed.

## Sprint 13 validation

- TypeScript: passed.
- ESLint: passed with no warnings.
- Unit tests: all 39 passed.
- Aggregate tests: all 39 unit tests passed; 39 integration tests could not reach the configured PostgreSQL database in the sandbox and failed in unchanged Prisma setup hooks.
- Production build: passed; `/free-quotation-template` is statically prerendered.
- Production HTML: returned 200 with exactly one H1, 31 editable fields, `index, follow`, the expected title and description, and the canonical `https://quotevia.co.za/free-quotation-template`.
- `sitemap.xml`: returned 200 and contained exactly the four intended public marketing routes.
- Automated in-app browser visual and native print-dialog testing was unavailable because no browser session was attached. Manual print-preview and responsive viewport checks remain required before deployment.
- `git diff --check`: passed.

## Acquisition and indexation

- `/`, `/online-quote-maker`, `/quotation-software-south-africa`, and `/free-quotation-template` are indexable, have self-referencing canonical URLs, and are the only routes in `sitemap.xml`.
- The online quote maker page focuses on preparing a complete quote, the create/send/track/approval workflow, and suitability for small service businesses.
- The South African quotation software page focuses on ZAR presentation, tax and discounts, secure delivery, status visibility, and local service-business use cases.
- The pages share a lightweight public header and footer, while their main content, headings, FAQs, and search intent remain distinct.
- The homepage and shared marketing navigation link to the acquisition pages and free quotation template; the resource links back into the full public acquisition cluster.
- Existing Organization, WebSite, WebPage, and SoftwareApplication homepage JSON-LD remains unchanged. No duplicated landing-page schema, ratings, reviews, offers, customer counts, or testimonials were added.
- `/login`, `/signup`, `/onboarding`, all authenticated application routes, `/help`, and `/q/[token]` remain noindex. Secure Quote URLs remain absent from the sitemap and retain their `X-Robots-Tag: noindex, nofollow` response header.
- No Prisma schema, migrations, environment variables, Server Actions, Route Handlers, authentication logic, quote behavior, pricing logic, or customer workflow changed.

## Sprint 12 validation

- TypeScript: passed.
- ESLint: passed with no warnings.
- Unit tests: all 39 passed.
- Aggregate tests: all 39 unit tests passed; 39 integration tests could not reach the configured PostgreSQL database in the sandbox and failed in unchanged Prisma setup hooks.
- Production build: passed; both new pages are statically prerendered.
- Production HTML: all three public marketing routes returned 200, had exactly one H1, emitted index/follow metadata, and resolved the expected canonical and page title.
- `sitemap.xml`: returned 200 and contained exactly the three public marketing routes; no customer Quote token appeared.
- Invalid `/q/[token]`: returned 404 with `X-Robots-Tag: noindex, nofollow`.
- `/login` and `/signup`: returned 200 with `noindex, nofollow`; unauthenticated private routes continued redirecting to `/login`.
- `git diff --check`: passed.

## QuoteVia branding alignment

- Replaced the previous customer-facing brand name with QuoteVia across the shared logo, marketing page, authentication pages, authenticated help/settings copy, and public Quote fallback navigation.
- Updated the default page-title template, homepage SEO title and description, application name, Open Graph/Twitter metadata, social-image text, image alt text, favicon label, email sender example, and fallback support address.
- Kept internal package names, development IDs, and architecture terminology unchanged because they are not exposed as product branding.

## SEO audit baseline

- The root-level App Router contained one public marketing page (`/`), public authentication pages, protected onboarding/application routes, one authenticated Help page, an Auth.js API route, and secure public `/q/[token]` Quote pages.
- Before this sprint, only the root layout exported basic title and description metadata.
- The homepage had one abstract H1 and three H2 sections, but no canonical, robots directive, Open Graph/Twitter metadata, or structured data.
- `robots.txt` and `sitemap.xml` returned 404.
- Authentication, application, onboarding, and customer Quote routes had no explicit page/layout noindex metadata.
- The favicon was the placeholder Vercel triangle and there was no branded social image.

## Indexation strategy

- `/`, `/online-quote-maker`, `/quotation-software-south-africa`, and `/free-quotation-template` are the indexable routes and the only sitemap entries.
- `/login` and `/signup` are public but explicitly `noindex, nofollow`.
- `/onboarding` and the shared authenticated application layout are explicitly `noindex, nofollow`.
- `/help` remains authenticated and noindex; it was not moved or duplicated as a public marketing page.
- Every `/q/[token]` customer Quote inherits `noindex, nofollow`; tokens are never included in the sitemap.
- Auth/API and protected application paths are excluded from crawl queues in `robots.txt`; access control continues to be enforced by Auth.js and server-side organisation helpers.

## Homepage SEO delivered

- Final title: `Online Quote Tool for Small Businesses | QuoteVia`.
- Final description: `Create professional quotes, send them online, track when customers view them, and get approvals faster with QuoteVia.`
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
- Added `app/sitemap.ts`; it now contains only the homepage and the two public acquisition pages.
- Added `X-Robots-Tag: noindex, nofollow` response headers for Auth/API and secure Quote paths.
- Added a permanent `www.quotevia.co.za` to `quotevia.co.za` redirect when the request reaches the application on the www host.
- Added a linked homepage JSON-LD graph with Organization, WebSite, WebPage, and SoftwareApplication nodes.
- The Organization business entity includes the canonical URL and a crawlable 180×180 logo, while omitting unverified physical location, opening hours, reviews, ratings, and other fabricated properties.
- The WebSite identifies the Organization as publisher; the WebPage connects the site, business, primary social image, and software product through stable `@id` references.
- FAQ structured data was intentionally omitted; the FAQ remains visible content, but QuoteVia is not eligible for Google's limited FAQ rich-result treatment.
- Replaced the placeholder favicon with a branded SVG icon and added a generated Apple touch icon.
- Added a 1200×630 branded Open Graph image reused for Twitter cards.
- Installed Google Tag Manager container `GTM-NNNSRZSB` in the root layout without adding a third-party analytics package; the bootstrap runs in the head and the fallback iframe renders immediately after the opening body tag.

## Architecture and database

- No Prisma schema or migration changes were required.
- No Server Actions, Route Handlers, authentication logic, tenant access, Quote business logic, or database queries were changed.
- No dependencies or environment variables were added.
- `APP_URL` documentation now states that production must use `https://quotevia.co.za` because it drives secure Quote links and canonical metadata.

## Validation

- TypeScript: passed.
- ESLint: passed with no warnings.
- Unit tests: 39 passed, including homepage entity-linking, organization-logo, and safe JSON-LD serialization coverage.
- Integration tests: the sandboxed aggregate run could not connect to PostgreSQL; the approved network retry passed all 34 integration tests.
- Production build: passed; `/`, `/apple-icon`, `/icon.svg`, `/opengraph-image`, `/robots.txt`, and `/sitemap.xml` are statically generated.
- Production homepage HTML: one H1; correct title, description, canonical, index/follow, Open Graph, Twitter, and syntactically valid linked Organization, WebSite, WebPage, and SoftwareApplication JSON-LD.
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
