# Animation Guidelines — Pragati Furniture Website (v2)

> **v2 changes:** adds a motion-token system, lazy-loaded animation library, a phased rollout plan with acceptance criteria, and specs for gallery/lightbox, FAQ accordion, header, form feedback, WhatsApp pulse, and image loading. Sections 1–5 keep and tighten the v1 rules (scroll reveals, hover, page fade, featured stack). Where v1 and v2 differ, v2 wins.

## 0. Goal and Tone

Animation exists to make products feel tangible and the shop feel trustworthy — not to show off. The site is warm and traditional (olive/cream, serif headings), and visitors are mostly local people on mid-range Android phones. Every animation must pass this test: *does it help the visitor look at furniture, understand what happened, or act — without slowing the page down?* If not, cut it.

**Not doing (by design):** parallax heroes, cursor-follow effects, animated headline text on the first screen, looping background motion, anything that moves the LCP element.

## 1. Tooling

### Library: `motion` (already installed)
Use `motion/react` only for animations that need JS: scroll reveals, staggers, drag (featured stack), lightbox transitions. Everything else should be **plain CSS** (hover zooms, accordion, WhatsApp pulse, button states) — zero JavaScript cost.

### Load it lazily (Phase 1 task)
The full `motion` component ships a lot of code. Use `LazyMotion` with the smaller `m` component so animation code is loaded on demand and stays small:

```tsx
// components/public/MotionProvider.tsx
"use client";
import { LazyMotion, domAnimation } from "motion/react";

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
```
```tsx
// usage in existing primitives (RevealOnScroll, StaggerGrid, template.tsx)
import * as m from "motion/react-m";
<m.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} />
```
- Wrap the `(public)` layout's children in `MotionProvider`. `strict` makes the build fail loudly if someone accidentally uses the heavy `motion.div`.
- `domAnimation` covers animate/hover/inView. **Drag and layout animations need `domMax`** — load that *only* for the featured stack (Section 6), via an async feature import so it isn't in the main bundle.
- Confirm the saving with the build output / bundle analyzer rather than assuming.

### Motion tokens (single source of truth, like the color tokens)
Put these next to the brand tokens in `globals.css`; components reference them, never raw numbers scattered around:

```css
:root {
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);      /* default for entrances */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);   /* for things that move and settle */
  --dur-fast: 150ms;   /* hovers, button states */
  --dur-base: 250ms;   /* fades, accordion, crossfades */
  --dur-slow: 400ms;   /* scroll reveals, lightbox */
}
```
JS animations use the same values (`duration: 0.25`, `ease: [0.22, 1, 0.36, 1]`).

## 2. Core Principles (non-negotiable — protect SEO and performance)

1. **Animate only `opacity` and `transform`.** Animating width/height/margin causes layout shift and hurts CLS. *One deliberate exception:* the FAQ accordion (Section 5.3), because it is user-initiated (CLS ignores shifts right after a click/tap) and sits below the fold.
2. **Never delay above-the-fold content.** Hero, page title, primary CTA, and the first product image render immediately. The LCP image never fades in — use `priority` and no entrance animation on it.
3. **Respect `prefers-reduced-motion`.** Motion's `useReducedMotion()` for JS animations; a global CSS guard for CSS ones (already in `globals.css` — keep it). With reduced motion, content simply appears; nothing breaks.
4. **Keep it short.** 150–400ms. Nothing decorative over 400ms.
5. **Animation never gates content.** All content exists in the server-rendered HTML. Animations only change how already-present elements appear — no conditional mounting that hides content from crawlers.
6. **Hover effects only where hover exists.** Wrap in `@media (hover: hover) and (pointer: fine)` so touch devices don't get stuck hover states.
7. **No layout shift from media.** Every image container has a fixed `aspect-ratio` so nothing jumps as images load.
8. **Do not animate:** the enquiry form's entrance (friction-free beats polish where people convert), admin panel pages (internal tool — keep it snappy).

## 3. Baseline (already built — verify, don't rebuild)

Reported as done by Claude Code; Phase 1 verifies them with Playwright:
- `RevealOnScroll` — fade-up once, `-80px` trigger margin
- `StaggerGroup` / `StaggerItem` — staggered grid reveal with optional hover lift
- `app/(public)/template.tsx` — 0.2s fade-only page transition (fade only; never add slide/scale here)
- `.btn-primary` hover scale (fine pointer + motion allowed only)
- Global reduced-motion guard in `globals.css`

## 4. Phased Rollout

Each phase = its own branch/commit(s) using Conventional Commits (e.g. `feat(anim): add product lightbox`). Do not start a phase until the previous one passes its checks.

### Phase 0 — Clear the deck (before any new animation)
Animating on a shaky base wastes effort. Confirm first:
- Login validation bug fixed and re-verified with Playwright
- Lint errors fixed (`npm run lint` clean)
- Standalone `/faq` route fully removed (FAQ is a homepage section — see SEO.md)
- `git log` shows prior work committed; working tree clean

### Phase 1 — Foundation (no visible change expected)
- Add motion tokens to `globals.css`
- Add `MotionProvider` (LazyMotion) and migrate existing primitives from `motion.*` to `m.*`
- Verify the baseline animations still work (scroll, hover, page fade) via Playwright
- **Check:** `npm run build` clean; record Lighthouse (mobile) scores for Home and one Product page as the **"before" baseline** — save the numbers in the PR description

### Phase 2 — Low-risk, high-value
Build in this order (Section 5 has each spec):
1. Product gallery crossfade + lightbox
2. Card image hover zoom
3. FAQ accordion (homepage section)
4. Enquiry form feedback (button states + success check)
5. WhatsApp button attention pulse
6. Image loading polish (placeholder + fade-in)

**Check:** Lighthouse mobile scores not worse than baseline (CLS ≈ 0, LCP under 2.5s); everything works with reduced-motion on.

### Phase 3 — Signature moments
1. Featured stack deck on the homepage (Section 6)
2. Header scroll behavior (Section 5.7)
3. Optional trust strip count-up (Section 5.8) — **blocked until your uncle provides real numbers**

**Check:** test on a real mid-range Android phone; drag must not block vertical page scroll.

### Phase 4 — Quality gate
- Lighthouse before/after comparison (from Phase 1 baseline)
- Windows "Animation effects: off" test — site fully usable
- Playwright walkthrough: home → category → product → lightbox → enquiry submit
- Only now run the Impeccable `animate`/`polish` pass — instruct it explicitly: *"Follow docs/ANIMATIONS.md exactly. Use the `motion` library and the tokens defined there. Do not introduce another animation library or change durations/easing."*

## 5. Specs

### 5.1 Product gallery + lightbox
- Main image sits in a fixed `aspect-ratio: 4/3` frame (no CLS). Thumbnails below/side.
- **Switching images:** crossfade, `--dur-base`. Stack the incoming image over the outgoing one and fade `opacity`; no sliding.
- **First image:** `priority`, no fade on initial load (it's the LCP element).
- **Lightbox:** use the native `<dialog>` with `showModal()` — it gives focus trapping, Esc-to-close, and a backdrop for free (accessibility without extra code).
  - Open: backdrop fades in (`--dur-base`); image fades and scales from 0.96 → 1 (`--dur-slow`, `--ease-out`).
  - Prev/Next buttons + ArrowLeft/ArrowRight keys; horizontal swipe on touch.
  - Zoom v1: tap/click toggles 2× using `transform: scale()` with `transform-origin` at the tap point. Skip custom pinch-zoom.
  - Load the lightbox component with `next/dynamic` **only when first opened** — zero cost on initial page load. Request the larger Cloudinary size only at that point.
- Buttons need `aria-label`s; focus returns to the trigger on close.

### 5.2 Card image hover zoom (category + product cards)
Pure CSS, no JS:
```css
.card-media { overflow: hidden; aspect-ratio: 4 / 3; border-radius: 0.5rem; }
.card-media img { transition: transform var(--dur-slow) var(--ease-out); }
@media (hover: hover) and (pointer: fine) {
  .card:hover .card-media img { transform: scale(1.05); }
}
```
The frame never changes size — only the image inside scales — so there is no layout shift. This replaces (does not stack on top of) the card lift where both would feel busy; keep the lift shadow subtle.

### 5.3 FAQ accordion (homepage section)
- Content stays in the DOM when collapsed (crawlable). Use the CSS grid-rows technique:
```css
.faq-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--dur-base) var(--ease-out); }
.faq-item[data-open="true"] .faq-panel { grid-template-rows: 1fr; }
.faq-panel > div { overflow: hidden; }
```
- Chevron rotates 180° (`transform`, `--dur-base`).
- Accessibility: each question is a `<button aria-expanded aria-controls>`; panel has an `id`. Keyboard: Enter/Space toggles. Allow multiple open at once (simpler, less surprising).
- Data comes from `GET /api/faqs` (active FAQs, `displayOrder`). Keep the `FAQPage` JSON-LD — see SEO.md.

### 5.4 Enquiry form feedback
- **Button states:** idle → loading (spinner, button disabled, width fixed so the label swap doesn't shift layout) → success.
- **Success:** replace the form area with a confirmation; draw a checkmark with an SVG `pathLength` animation (`--dur-slow`). Announce via `aria-live="polite"`.
- **Errors:** field error text fades in (`--dur-fast`); no shaking.
- The form itself does **not** animate in on scroll (Principle 8).

### 5.5 WhatsApp button attention pulse
- CSS keyframes on a pseudo-element ring (`transform: scale` + `opacity`), **2 iterations only**, starting ~3s after load, then still. Never loops forever.
- Disabled entirely under reduced motion.
- Purpose: nudge toward the main lead channel without nagging.

### 5.6 Image loading polish
- Every image frame has a `--brand-cream-dark` background so blank space looks intentional, and the image fades in (`opacity`, `--dur-base`) on load.
- **Exception:** the LCP/first image — no fade, `priority`.
- Optional later upgrade (requires a schema change, so **decide before doing it**): store a tiny `blurDataURL` per `ProductImage` at upload time and use `next/image` `placeholder="blur"`. Not needed for v1.

### 5.7 Header scroll behavior
- Header height stays **constant** (no reflow). On scroll past a small threshold, fade in a soft shadow and slightly tighten the logo via `transform: scale(0.94)`.
- Detect scroll with an `IntersectionObserver` on a sentinel element near the top — not a scroll listener firing every frame.
- Sticky/fixed positioning must respect the safe area and never overlap content.

### 5.8 Trust strip count-up (optional — blocked on real data)
- Only if your uncle provides real numbers (years in business, etc.). Never animate invented figures.
- The **final number is in the server-rendered HTML**; on scroll-into-view it animates from 0 once. Reduced motion → show the final number immediately.

## 6. Featured Stack Effect (Homepage Only)

A Tinder-style stacked deck for featured products/categories: cards overlap slightly; the front card can be dragged/swiped to bring the next one forward. **Homepage only** — category pages need scannable grids, not one-at-a-time browsing.

### Behavior
- 3–4 cards visible in the stack, each offset and scaled down behind the front one.
- Front card draggable horizontally; swiping past ~100px **or** with enough velocity advances the stack. Under the threshold, it snaps back.
- Visible Prev/Next buttons alongside the gesture — **never drag-only** (mouse-only, screen-reader, and motor-impairment users).
- All cards stay in the DOM at all times; only position/z-index/opacity change (crawlable). Off-top cards use `aria-hidden`.
- **Mobile scroll safety:** the draggable card must set `touch-action: pan-y` so a vertical swipe still scrolls the page. Test this on a real phone.
- Keep to 5–6 hand-picked featured items, not the whole catalog.

### Loading
Drag needs Motion's `domMax` features. Load them **only for this component**, and load the component itself with `next/dynamic` since it is below the fold:
```tsx
<LazyMotion features={() => import("./motionMaxFeatures").then(m => m.default)} strict>
  {/* FeaturedStack */}
</LazyMotion>
```
(`motionMaxFeatures.ts` default-exports `domMax`.)

### Starting-point implementation
Treat this as a sketch — verify the interplay between `drag` and `animate` in the real build:
```tsx
"use client";
import { useState } from "react";
import * as m from "motion/react-m";
import type { PanInfo } from "motion/react";

interface StackItem { id: string; render: () => React.ReactNode; }

export default function FeaturedStack({ items }: { items: StackItem[] }) {
  const [active, setActive] = useState(0);
  const advance = (d: 1 | -1) => setActive((p) => (p + d + items.length) % items.length);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const passed = Math.abs(info.offset.x) > 100 || Math.abs(info.velocity.x) > 500;
    if (passed) advance(info.offset.x < 0 ? 1 : -1);
  };

  const visible = [0, 1, 2].map((o) => (active + o) % items.length);

  return (
    <div style={{ position: "relative", height: 420 }}>
      {items.map((item, i) => {
        const pos = visible.indexOf(i);
        const shown = pos !== -1;
        return (
          <m.div
            key={item.id}
            drag={pos === 0 ? "x" : false}
            dragSnapToOrigin
            dragElastic={0.2}
            onDragEnd={pos === 0 ? onDragEnd : undefined}
            animate={{
              x: shown ? pos * 12 : 0,
              y: shown ? pos * 8 : 0,
              scale: shown ? 1 - pos * 0.05 : 0.9,
              opacity: shown ? 1 - pos * 0.15 : 0,
              zIndex: shown ? 10 - pos : 0,
            }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0, touchAction: "pan-y", cursor: pos === 0 ? "grab" : "default" }}
            aria-hidden={pos !== 0}
          >
            {item.render()}
          </m.div>
        );
      })}
      <div style={{ position: "absolute", bottom: -48, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 16 }}>
        <button onClick={() => advance(-1)} aria-label="Previous featured item">‹ Prev</button>
        <button onClick={() => advance(1)} aria-label="Next featured item">Next ›</button>
      </div>
    </div>
  );
}
```
Reduced motion: skip the stagger/scale transitions (instant position change); the buttons still work.

## 7. Testing Checklist (every phase)
- **Reduced motion:** Windows → Settings → Accessibility → Visual effects → Animation effects **off**. Site fully usable, nothing broken.
- **Lighthouse (mobile)** on Home and a Product page: compare to the Phase 1 baseline. CLS stays near 0; LCP under 2.5s; no regression.
- **Real mid-range Android phone**, not just a laptop: no jank, drag doesn't fight vertical scroll.
- **Keyboard only:** lightbox, accordion, and stack controls reachable and operable; visible focus.
- **Playwright** walkthrough after each phase: home → category → product → lightbox → enquiry submit, watching for console errors.
- **View source check:** disable JS and confirm all text content (products, FAQ answers, trust numbers) is still in the HTML.

## 8. Instructions to Give Claude Code / Skills
- "Docs are the source of truth: `docs/DESIGN.md` (colors, type) and this file (motion). Skills (Impeccable, 21st, etc.) execute against them and don't override them."
- Do one phase at a time; one commit per feature; run the phase check before starting the next.
- Don't add another animation library (no GSAP, no React Bits copies). One library: `motion`.
- If a spec here conflicts with what a skill suggests, follow this file and tell me about the conflict.
