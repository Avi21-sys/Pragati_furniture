# Project Brief — Pragati Furniture Website

## 1. Business Context
- **Business name:** Pragati Furniture
- **Location:** Muzaffarnagar, Uttar Pradesh, India
- **Store type:** Single physical store (no multiple branches)
- **Industry:** Furniture retail (offline shop going online for the first time)

## 2. Project Goal
Build a **simple, fast, SEO-friendly informational + catalog website** for Pragati Furniture.

This is **NOT an e-commerce site**. There is no cart, no online payment, and no order checkout in this version. The purpose of the site is to:
1. Showcase the shop's furniture catalog online
2. Let potential customers browse products by category
3. Let customers reach out via a contact/enquiry form or WhatsApp
4. Rank on Google for relevant local searches (e.g. "furniture shop in Muzaffarnagar")

## 3. Users of the System

### End Customers (Public)
- Browse furniture products and categories
- View product details (photos, price, dimensions, material, description)
- Submit an enquiry via a contact form
- Contact the shop directly via WhatsApp click-to-chat
- Find shop location, hours, and contact details

### Admin (Shop Owner — Uncle / Staff)
- Log in to a simple admin panel (secured)
- Add, edit, and delete products
- Add, edit, and delete categories
- View submitted customer enquiries

## 4. Scope

### In Scope (v1)
- Public-facing catalog website (Home, Categories, Product Detail, About, Contact)
- Enquiry form (stored in DB + optionally emailed to shop owner)
- WhatsApp click-to-chat button (on product pages and contact page)
- Admin panel for product/category CRUD (JWT-secured login)
- Basic SEO setup: clean URLs, meta tags, sitemap, structured data, local SEO
- Responsive design (mobile-first — most local customers will browse on phone)

### Out of Scope (v1) — explicitly excluded for now
- Online payments / checkout
- Shopping cart
- User accounts / customer login
- Multi-language support
- Multiple store locations
- Order tracking / delivery management
- Reviews/ratings system

> Note: These may be considered in a future version, but Claude Code (and any contributor) should **not** build toward these unless explicitly requested later.

## 5. Catalog Size (for reference during development)
- Approx. **under 30 products** total at launch
- Small number of categories (exact list to be finalized with shop owner — e.g. Sofas, Beds, Dining Sets, Wardrobes, Chairs, etc.)

## 6. Branding Status
- Shop name is finalized: **Pragati Furniture**
- Logo and brand colors are **not yet decided** — placeholder/neutral styling will be used until finalized, but the design should be built in a way that's easy to re-theme later (centralized color/typography config, not hardcoded styles scattered across components)

## 7. Timeline
- No fixed deadline — this is a **learning-paced freelance project**. Priorities are correctness, clean architecture, and using this as a genuine learning exercise (SEO, CI/CD, microservices) alongside delivering a working site for the client.

## 8. Success Criteria
- Site loads fast and works well on mobile
- All ~30 products are browsable and easy to find via categories
- Enquiry form and WhatsApp button both work reliably
- Admin (uncle) can independently add/update products without developer help
- Site is indexed by Google and shows up for local furniture search terms in Muzaffarnagar
