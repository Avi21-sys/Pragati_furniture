# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Local furniture shoppers (primary audience):** people in and around Muzaffarnagar, Uttar Pradesh, India, most browsing on mobile phones. Their job is to find out what the shop offers (sofas, beds, dining sets, wardrobes, chairs, and so on), see products and whether a price is published, get a feel for the store, and get in touch — via an enquiry form or WhatsApp click-to-chat — plus find the store's location, hours, and contact details. Many arrive first-time from Google local search.
- **Shop owner and staff (admin):** the shop owner and whoever helps run the store. Their job is to independently add, edit, and delete products and categories and to review submitted customer enquiries, without developer help. Adding a product must not require touching code.

## Product Purpose

A fast, mobile-friendly, SEO-focused informational + catalog website for Pragati Furniture, a single physical furniture store in Muzaffarnagar going online for the first time. It displays the store's catalog, lets visitors browse by category, captures sales leads through an enquiry form and WhatsApp click-to-chat, and helps the shop rank on Google for local searches such as "furniture shop in Muzaffarnagar." Success means the site loads quickly on mobile, all launch products are browsable, enquiries and WhatsApp messages arrive reliably, the owner can update the catalog unaided, and the store surfaces in local furniture searches.

It is explicitly **not** e-commerce: there is no cart, checkout, or online payment in this version.

## Positioning

The site's position rests on a real, established family-run furniture shop in Muzaffarnagar: it is the online storefront that brings the physical shop's selection and trustworthiness to Google and to nearby shoppers. Conversions are enquiries, WhatsApp messages, and footfall — not orders. That mechanism is something an anonymous drop-shipper or generic online furniture marketplace could not truthfully copy.

## Operating Context

- Single physical store in Muzaffarnagar, Uttar Pradesh, India; one owner and a small staff; no branches.
- The shop owner supplies product information and photos; the ~30-product launch catalog is not yet assembled (sample products are currently seeded for development only). The owner enters real products through the admin panel once content is gathered.
- Store identity "Pragati Furniture" is in active use, but the NAP/contact facts — phone, WhatsApp number, exact address lines, and hours — are placeholders pending confirmation from the owner (see Capabilities and Constraints).
- Development context: a learning-paced freelance project with no fixed deadline; priorities are correctness and clean architecture, and it doubles as a deliberate learning exercise (local SEO, CI/CD). Two independently runnable apps: the Next.js frontend (which also hosts the API routes) and a separate Express notification-service that sends enquiry-notification emails.
- Currently running locally only. Planned-but-not-deployed: frontend on Vercel, notification-service on Render/Railway, Cloudinary for product images, a PostgreSQL database (local or a cloud instance such as Neon/Supabase/Render).

## Capabilities and Constraints

Confirmed capabilities (v1, implemented in the codebase):
- Public catalog pages: home, products by category, product detail, about, contact.
- Enquiry form persists to the database (customer name, phone, optional email and message, optional linked product) with a NEW / CONTACTED / CLOSED status; submission can notify the owner by email via the notification service.
- WhatsApp click-to-chat button, persistent as a floating action.
- JWT-secured admin panel (`/admin`): product CRUD, category CRUD, Cloudinary image upload/organization, enquiry review and status changes.
- SEO groundwork: slug-based clean URLs, per-page metadata with canonical and Open Graph, JSON-LD structured data, sitemap, robots.txt, local-SEO meta (e.g. NAP in JSON-LD once real).
- Mobile-first responsive design.

Deliberately out of scope (present, not missing): payments/checkout, shopping cart, customer accounts/logins, multi-language support, multiple store locations, order tracking/delivery management, reviews/ratings. Contributors should not build toward these unless explicitly asked later.

Explicitly undecided / pending owner confirmation:
- Store NAP: display phone, WhatsApp number, address lines, opening hours (currently placeholders in `frontend/lib/constants.ts`).
- Exact category list and the ~30 launch products, including real product names, descriptions, prices, and photos.
- Brand logo and exact brand color values (a committed direction exists — see Brand Commitments).

Confirmed customs and constraints:
- Site content is in English (Open Graph locale `en_IN`); multi-language is deliberately out of scope for v1.
- Prices may be unpublished ("Price on request"): the price field is nullable.
- Categories are created first through the admin panel; products must reference a valid category.
- All theme tokens and business facts are centralized (design tokens / a single constants file, not scattered hardcoded values) so the still-pending identity can be dropped in later without a rewrite.

## Brand Commitments

- Business name is finalized: **Pragati Furniture** — used consistently across the site, page titles, and structured data.
- The owner has committed to a warm, traditional, trustworthy character with an **olive/forest-green + cream** palette and a muted gold accent. The exact hex values are currently proposed in `docs/DESIGN.md` and await owner confirmation (a photo of the actual store signage will correct them); the logo is not yet finalized.
- WhatsApp click-to-chat is a primary conversion path and should stay prominent on product and contact surfaces.

## Evidence on Hand

- Business brief: `docs/Project Scope.md` (name, location, scope, users, success criteria).
- Working implementation: Next.js 16 frontend with the public catalog, admin panel, and API routes (`frontend/app`); Prisma schema and initial migration (`frontend/prisma`); supporting docs `docs/API.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/SEO.md`, `docs/CONVENTIONS.md`, `docs/SETUP.md`, `docs/CICD.md`.
- Visual direction recorded in `docs/DESIGN.md`.
- Confirmed absences (must not be fabricated): owner-verified store contact details; the real ~30-product catalog (names, prices, photos); customer reviews or testimonials; any live deployment or real domain (local dev only).

## Product Principles

- **Accuracy over completeness.** Nothing about the real business — phone, address, prices, photos, testimonials — is invented; undecided facts stay explicit placeholders until the owner confirms them.
- **Conversion by contact, not checkout.** The site's job is leads: enquiry form and WhatsApp. Every surface should make reaching the shop easy.
- **Owner independence.** Adding or updating a product or category must be possible through the admin panel alone, without developer involvement.
- **Local SEO is core.** Fast, mobile-first, clean URLs and metadata, so the store surfaces for Muzaffarnagar furniture searches.
- **Built to re-brand.** Theme and business facts stay centralized so the still-pending identity lands without a rewrite.

## Accessibility & Inclusion

- The confirmed audience signal is that most local customers browse on phones, so mobile-first responsive behavior is a standing requirement rather than an afterthought.
- WhatsApp click-to-chat serves as a lower-friction channel for customers who would rather message than fill in a form; the enquiry form itself should be short and usable on a small screen.
- No specific accessibility standard has been established with the client.