# Animation Guidelines — Pragati Furniture Website

## 1. Library Choice: Motion (formerly Framer Motion)

Use the **`motion`** package (npm: `motion`, the renamed/current version of Framer Motion) — it's the standard animation library in the Next.js/React ecosystem, has built-in scroll-triggered animation support (`whileInView`), and works cleanly with the App Router once wrapped in Client Components.

```bash
npm install motion
```

> Note: this only animates Client Components. Your public pages are Server Components by default (that's what makes SSG/ISR work) — so animated elements need a small `"use client"` wrapper component around just the animated part, not the whole page. This keeps the actual data-fetching and static generation untouched, while still allowing animation on top.

## 2. Core Principles (non-negotiable, protects SEO/performance work already done)

1. **Never animate layout-affecting properties** — only animate `opacity` and `transform` (translate, scale). Animating `width`, `height`, `margin`, etc. causes layout shift, which directly hurts your Cumulative Layout Shift (CLS) score from SEO.md.
2. **Above-the-fold content must not be delayed by animation** — the hero section, page title, and primary CTA should be visible immediately, not fade in after a delay. Reserve entrance animations for content the user scrolls to, not the first thing they see.
3. **Respect `prefers-reduced-motion`** — some users disable animations at the OS level (motion sensitivity, accessibility). Always check this and skip/reduce animation for those users. Motion's `useReducedMotion()` hook handles this in one line.
4. **Keep durations short** — 150–400ms for most transitions. Anything longer starts to feel sluggish rather than polished.
5. **Animations enhance, never gate content** — never rely on JavaScript animation to reveal content required for SEO indexing; if JS fails to load, content must still be present in the HTML (this is automatically true if you only animate opacity/transform on already-rendered elements, rather than conditionally rendering them via animation state).

## 3. Specific Animations

### Hover Effects

**Product cards** — subtle lift on hover:
```tsx
"use client";
import { motion } from "motion/react";

<motion.div
  whileHover={{ y: -4, boxShadow: "0 8px 20px rgba(42,54,33,0.15)" }}
  transition={{ duration: 0.2 }}
>
  {/* card content */}
</motion.div>
```

**Buttons** — gentle scale + background shift (background color transition can stay plain CSS, no need for Motion):
```css
.btn-primary {
  transition: background-color 0.2s ease, transform 0.15s ease;
}
.btn-primary:hover {
  transform: scale(1.02);
}
```

### Scroll-Triggered Reveals

Use `whileInView` for sections as the user scrolls — category grid, "why choose us" content, footer sections:
```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";

function RevealOnScroll({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```
- `viewport={{ once: true }}` — animation plays once, doesn't re-trigger every time the user scrolls past it (re-triggering feels gimmicky, not polished)
- `margin: "-80px"` — triggers slightly before the element is fully in view, feels more natural than waiting for the exact edge

Apply this wrapper around: category cards on the homepage, product grid items (staggered — see below), the "About" page content blocks.

**Staggered reveal for grids** (product/category cards appearing one after another, not all at once):
```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  transition={{ staggerChildren: 0.08 }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
      <ProductCard {...item} />
    </motion.div>
  ))}
</motion.div>
```

### Page Transitions

Implemented via a `template.tsx` file in the `(public)` route group (Next.js re-mounts `template.tsx` on every navigation, unlike `layout.tsx` which persists — exactly the hook needed for transition animation):

```tsx
// app/(public)/template.tsx
"use client";
import { motion, useReducedMotion } from "motion/react";

export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
```
Deliberately simple — **fade only, no slide/scale on page transitions.** This is the one place to resist adding more "presence" — a page transition sits directly between the user and the content they came for, so it needs to be fast and unobtrusive, not a showcase moment.

## 4. Featured Stack Effect (Homepage Only)

A Tinder-style stacked deck for the homepage's featured products/categories section — cards overlap slightly, the front card can be dragged/swiped, and swiping brings the next card forward. **Homepage only** — not used on category listing pages, where users need to scan many items at once, not one-at-a-time.

### Behavior
- 3–4 cards visible in the stack at once, each slightly offset and scaled down behind the front one (creates depth)
- Front card is draggable horizontally; dragging past a threshold (~100px) swipes it away and brings the next card to front
- Includes visible prev/next arrow buttons alongside the drag gesture — **not drag-only**, since not everyone will discover or be able to use a swipe gesture (mouse-only desktop users, screen reader users, motor-impairment accessibility)
- All cards remain in the DOM at all times — only their visual position/z-index changes. This keeps every featured item crawlable by search engines regardless of which one is currently "on top"

### Implementation
```tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "motion/react";

interface StackItem {
  id: string;
  render: () => React.ReactNode;
}

function FeaturedStack({ items }: { items: StackItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const advance = (direction: 1 | -1) => {
    setActiveIndex((prev) => (prev + direction + items.length) % items.length);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -100) advance(1);
    else if (info.offset.x > 100) advance(-1);
  };

  const visibleStack = [0, 1, 2].map((offset) => (activeIndex + offset) % items.length);

  return (
    <div style={{ position: "relative", height: 420 }}>
      {/* All items rendered for SEO/crawlability — visually hidden ones use aria-hidden */}
      {items.map((item, i) => {
        const stackPosition = visibleStack.indexOf(i);
        const isVisible = stackPosition !== -1;

        return (
          <motion.div
            key={item.id}
            drag={stackPosition === 0 ? "x" : false}
            onDragEnd={stackPosition === 0 ? handleDragEnd : undefined}
            animate={{
              x: isVisible ? stackPosition * 12 : 0,
              y: isVisible ? stackPosition * 8 : 0,
              scale: isVisible ? 1 - stackPosition * 0.05 : 0.9,
              opacity: isVisible ? 1 - stackPosition * 0.15 : 0,
              zIndex: isVisible ? 10 - stackPosition : 0,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ position: "absolute", inset: 0, cursor: stackPosition === 0 ? "grab" : "default" }}
            aria-hidden={stackPosition !== 0}
          >
            {item.render()}
          </motion.div>
        );
      })}

      {/* Accessible controls — not dependent on drag gesture */}
      <div style={{ position: "absolute", bottom: -48, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 16 }}>
        <button onClick={() => advance(-1)} aria-label="Previous featured item">‹ Prev</button>
        <button onClick={() => advance(1)} aria-label="Next featured item">Next ›</button>
      </div>
    </div>
  );
}
```

### Notes
- `dragElastic` can be added to `motion.div`'s drag config (e.g. `dragElastic={0.2}`) for a slightly springy resistance feel while dragging, if you want it to feel a bit more tactile
- Keep the stack to featured/highlighted items only (e.g. 5-6 hand-picked products or categories) — not the entire catalog; it's a highlight reel, not a browsing mechanism
- On mobile, this naturally responds to touch drag as well as mouse drag — Motion's `drag` prop handles both without extra code

## 5. What NOT to Animate
- Do not animate the hero/first-visible content on initial page load (see Principle 2)
- Do not add scroll-reveal animation to the enquiry form or any conversion-critical element — friction-free is more important than polish for anything the customer needs to actually act on
- Do not animate admin panel pages — it's an internal tool for your uncle, not a marketing surface; keep it snappy and utilitarian, animation there is wasted effort

## 6. Testing Checklist Before Calling This Done
- Toggle "Reduce motion" in your OS accessibility settings (Windows: Settings → Accessibility → Visual effects → Animation effects, off) and confirm the site still works smoothly with animations minimized
- Run Lighthouse/PageSpeed Insights again after adding animations — confirm CLS score hasn't regressed from what SEO.md targets (near 0)
- Check on an actual mid-range phone, not just desktop — animations that feel smooth on a laptop can stutter on budget Android phones, which are likely a meaningful share of this site's real traffic
