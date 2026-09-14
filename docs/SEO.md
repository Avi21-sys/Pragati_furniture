# SEO Requirements — Pragati Furniture Website

## 1. Goal
Rank on Google for local furniture-related searches in Muzaffarnagar, Uttar Pradesh (e.g. "furniture shop in Muzaffarnagar", "wooden sofa Muzaffarnagar", "Pragati Furniture"). Content is **English only** for v1.

## 2. URL Structure
Clean, human-readable, keyword-containing URLs — no query-string-based routing for core pages.

- Home: `/`
- Category page: `/products/{category-slug}` → e.g. `/products/sofas`
- Product detail page: `/products/{category-slug}/{product-slug}` → e.g. `/products/sofas/3-seater-wooden-sofa`
- About: `/about`
- Contact: `/contact`
- FAQ: `/faq`

> Note: this nests product URLs under category for stronger topical structure (helps Google understand site hierarchy). This is slightly different from the flat `/products/{slug}` implied in API.md's endpoint — the API endpoint stays flat (`GET /api/products/{slug}`, since slugs are globally unique), but the **frontend route** can still display the category in the URL path. Frontend routing and API structure don't need to match 1:1.

## 3. Rendering Strategy (Next.js)
| Page type | Strategy | Why |
|---|---|---|
| Home | SSG (Static) | Rarely changes, must load instantly |
| Category listing | ISR (Incremental Static Regeneration, revalidate ~1hr) | Product list changes occasionally when admin adds items |
| Product detail | ISR (revalidate ~1hr) | Same reasoning |
| About / Contact | SSG | Static content |
| FAQ | ISR (revalidate ~1hr) | Content changes when admin adds/edits FAQs, but infrequently |
| Admin panel (`/admin/*`) | Client-side rendered (CSR) | Not indexed, SEO irrelevant, needs interactivity |

Admin routes should also be excluded from indexing entirely (see Section 6).

## 4. Meta Tags (per page)
Every public page needs, at minimum:
- `<title>` — unique per page, format: `{Product/Category Name} | Pragati Furniture, Muzaffarnagar`
- `<meta name="description">` — unique, under ~155 characters, naturally includes location + product type
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:type`) — so shared links (e.g. on WhatsApp, since that's a key channel here) show a proper preview card
- Canonical URL tag — prevents duplicate-content issues

Example for a product page:
```html
<title>3-Seater Wooden Sofa | Pragati Furniture, Muzaffarnagar</title>
<meta name="description" content="Solid sheesham wood 3-seater sofa available at Pragati Furniture, Muzaffarnagar. Visit our store or enquire online today." />
```

## 5. Structured Data (JSON-LD)

### On Product pages — `Product` schema
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "3-Seater Wooden Sofa",
  "image": ["https://res.cloudinary.com/.../main.jpg"],
  "description": "Solid sheesham wood sofa with cushioned seating."
}
```
> **FINAL DECISION: the `offers` block is never included, for any product.** Since price is never displayed publicly (confirmed with shop owner — see DATABASE.md), including an `Offer` with a price in structured data would contradict what's actually shown on the page, which Google's guidelines explicitly discourage (structured data must match visible page content). This is a permanent rule, not a per-product judgment call — don't reintroduce `offers` unless the "no price" decision itself changes.

### FAQPage schema — on the FAQ page (`/faq`)
A high-value addition: Google can render FAQ questions directly in search results as an expandable list, taking up more visual space than a normal search snippet — genuinely useful for a page that's otherwise just text.
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do you offer home delivery?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we deliver across Muzaffarnagar and nearby areas..."
      }
    }
  ]
}
```
Generate this dynamically from the `Faq` table's active entries (same ones shown on the visible page) — structured data must always match visible content, never include hidden/inactive FAQs here.

### On Home/Contact page — `LocalBusiness` schema
```json
{
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  "name": "Pragati Furniture",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Muzaffarnagar",
    "addressRegion": "Uttar Pradesh",
    "addressCountry": "IN"
  },
  "telephone": "+91-XXXXXXXXXX"
}
```
(Exact address, phone, and opening hours to be filled in once confirmed with your uncle.)

## 6. Crawling & Indexing
- `sitemap.xml` — auto-generated, listing all category and product pages, regenerated whenever content changes (Next.js can generate this dynamically from the product/category API)
- `robots.txt` — allow all public pages, explicitly disallow `/admin/*`
```
User-agent: *
Disallow: /admin/
Sitemap: https://pragatifurniture.com/sitemap.xml
```
- Admin pages should also have `<meta name="robots" content="noindex, nofollow">` as a second layer of protection

## 7. Local SEO (High Priority for This Business)
Technical SEO alone won't drive much traffic for a local shop — local SEO signals matter more:
- Set up and fully complete a **Google Business Profile** (name, address, phone, hours, photos, category = Furniture Store) — this is often the single highest-impact action for local search visibility
- Ensure **NAP consistency** (Name, Address, Phone) is identical across the website, Google Business Profile, and any other listing (JustDial, IndiaMART, etc. if used)
- Embed a Google Map on the Contact page
- Encourage customers to leave Google reviews (outside the scope of this website build, but worth mentioning to your uncle)

## 8. Performance (Core Web Vitals)
Directly affects both SEO ranking and user experience:
- Use `next/image` for all product images — enables automatic lazy-loading, resizing, and modern formats (WebP/AVIF)
- Cloudinary should serve appropriately sized images (avoid shipping a 4000px photo for a 300px thumbnail)
- Keep JavaScript bundle size lean on public pages — avoid heavy client-side libraries on pages that don't need interactivity
- Target: Largest Contentful Paint (LCP) under 2.5s, Cumulative Layout Shift (CLS) near 0

## 9. Content Considerations
- Each category page should have a short (100-150 word) unique description, not just a product grid — pure product grids with no text tend to rank poorly, since there's little for Google to index as relevant content
- Alt text required on every product image (e.g. `alt="3-seater wooden sofa in dark brown, Pragati Furniture"`) — helps image search and accessibility
- **FAQ page content strategy**: write questions the way real customers actually phrase them in search (e.g. "Does Pragati Furniture deliver outside Muzaffarnagar?" rather than a generic "Delivery Policy" heading) — natural-language questions are exactly what FAQPage-eligible content is meant to capture, and they double as long-tail keyword targets. Good candidate topics: delivery area/cost, customization options, materials used, payment methods accepted, warranty, store timings. Actual questions/answers to be drafted from real customer questions your uncle hears in-store (see DATABASE.md Open Questions).

## 10. Tools to Set Up Post-Launch
- Google Search Console — submit sitemap, monitor indexing errors
- Google Business Profile
- PageSpeed Insights / Lighthouse — periodic Core Web Vitals checks
- (Optional, free) Google Analytics or a privacy-friendly alternative (Plausible) to track traffic sources
