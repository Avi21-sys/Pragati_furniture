# Design Direction — Pragati Furniture Website

## 1. Overall Feel
Warm, traditional, trustworthy — like walking into an established family furniture shop, not a sleek tech startup. Should feel grounded and premium-but-approachable, not flashy.

## 2. Color Palette

### Primary — Deep Olive/Forest Green
Used for: header background, primary buttons, section headings, active nav states
```
--brand-primary:        #3A4A2E   /* deep olive-forest green */
--brand-primary-dark:   #2A3621   /* darker shade — hover states */
--brand-primary-light:  #5C7050   /* lighter shade — secondary accents, borders */
```

### Background — Off-White / Cream
Used for: page background, card backgrounds
```
--brand-cream:          #FAF6EC   /* main page background */
--brand-cream-dark:     #F0E9D8   /* subtle section dividers, alternating backgrounds */
```

### Accent — Warm Gold/Brass
A small warm accent lifts the olive+cream combo from "plain earthy" to "traditional premium" — used sparingly, not as a dominant color:
```
--brand-accent:         #B8863B   /* muted brass/gold — used for small highlights, badges, hover underlines */
```

### Text
```
--text-primary:         #2A2A22   /* near-black warm charcoal, not pure black — softer on cream background */
--text-secondary:       #6B6B5E   /* muted olive-grey for secondary text, captions */
--text-on-primary:      #FAF6EC   /* cream text on dark green backgrounds (header, buttons) */
```

### Functional (unrelated to brand, but needed)
```
--color-success:        #4A7C59   /* enquiry submitted confirmation */
--color-error:          #A8453A   /* form validation errors */
```

> Note: These are my proposed exact hex values within your "olive/forest green + cream" direction — not something your uncle specified precisely. Treat these as a strong starting point; if his actual signage green is noticeably different (more yellow-olive vs more blue-forest), send a photo and I'll adjust these to actually match rather than just approximate the general idea.

## 3. Typography

Warm/traditional pairs well with a **serif for headings** (conveys heritage, craftsmanship) and a **clean sans-serif for body text** (keeps it readable, not stuffy).

- **Headings**: `"Lora"` or `"Playfair Display"` (Google Fonts, free) — serif with warmth, not overly formal
- **Body**: `"Inter"` or `"Work Sans"` (Google Fonts, free) — clean, highly legible at small sizes, good for product descriptions

```css
--font-heading: "Lora", Georgia, serif;
--font-body: "Inter", system-ui, sans-serif;
```

## 4. Layout & Spacing Principles

- **Generous whitespace** around product cards — furniture photography needs room to breathe, cramped grids make even good photos look cheap
- **Rounded corners, soft not sharp** — `rounded-lg` (Tailwind) on cards, buttons, images — feels warmer than sharp edges, fits the traditional-but-not-old-fashioned tone
- **Section dividers** using `--brand-cream-dark` as alternating background bands, rather than hard lines — keeps the page feeling continuous and warm rather than boxy
- **Product grid**: 3 columns desktop, 2 tablet, 1 mobile — enough room per card for a decent-sized photo, not so many columns that images shrink into thumbnails

## 5. Component Styling Direction

### Buttons
- Primary CTA (e.g. "Enquire Now", "Submit"): solid `--brand-primary` background, `--text-on-primary` text, `rounded-lg`, subtle shadow on hover, background shifts to `--brand-primary-dark` on hover
- Secondary/outline buttons: `--brand-primary` border and text, transparent background, fills with `--brand-cream-dark` on hover

### Product Cards
- White/cream card background, soft shadow (`shadow-sm`, growing to `shadow-md` on hover — a gentle lift effect)
- Image on top (consistent aspect ratio — e.g. 4:3 — so the grid stays visually aligned even with differently-shaped furniture photos)
- Product name in heading font, price in a slightly bolder weight, category shown as a small muted tag

### Header/Navigation
- Deep olive background, cream text and logo
- Category links in nav, WhatsApp icon/button prominent (since that's a primary conversion path per PROJECT.md)

### WhatsApp Button
- Should stand out slightly differently from the brand palette (WhatsApp's own green is close enough to your olive tone that it won't clash, but keep it visually distinct as a "different kind of action" — floating action button, bottom-right corner, persistent across pages)

## 6. Tailwind Config Mapping

This is what Claude Code should actually implement — centralizing all of the above into `tailwind.config.js` (or the CSS `@theme` block if using Tailwind v4, which your build already uses per the earlier build status) so no color/font is ever hardcoded directly in a component:

```css
/* globals.css — Tailwind v4 theme tokens */
@theme {
  --color-brand-primary: #3A4A2E;
  --color-brand-primary-dark: #2A3621;
  --color-brand-primary-light: #5C7050;
  --color-brand-cream: #FAF6EC;
  --color-brand-cream-dark: #F0E9D8;
  --color-brand-accent: #B8863B;
  --color-text-primary: #2A2A22;
  --color-text-secondary: #6B6B5E;
  --color-text-on-primary: #FAF6EC;
  --color-success: #4A7C59;
  --color-error: #A8453A;

  --font-heading: "Lora", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;
}
```
With this in place, components use classes like `bg-brand-primary`, `text-brand-cream`, `font-heading` — never a raw hex code — so if your uncle's actual brand colors get confirmed later (e.g. from real signage), changing these ~10 values updates the entire site instantly.

## 7. What NOT to do
- Don't use pure black (`#000000`) or pure white (`#FFFFFF`) anywhere — softer warm tones throughout keep the "traditional shop" feel instead of looking like a generic template
- Don't introduce a second accent color beyond the brass/gold — a busy palette undercuts the "warm, trustworthy" goal
- Don't use trendy sharp/brutalist UI patterns (hard borders, harsh contrast, sans-serif-only headers) — that reads as a tech product, not a furniture shop
