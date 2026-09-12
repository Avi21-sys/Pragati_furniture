// lib/constants.ts — business information and design-safe shared values.
// Kept in ONE place so the site is trivial to re-brand / update NAP details
// (per PROJECT.md §6 and SEO.md §7 — placeholder until confirmed with the owner).
// Brand colors are the ONLY thing that must "feel" neutral: they are defined here,
// surface as CSS variables in globals.css, and are consumed via Tailwind tokens.

export const STORE = {
  name: "Pragati Furniture",
  city: "Muzaffarnagar",
  region: "Uttar Pradesh",
  country: "IN",
  // --- NAP placeholders — confirm exact values with the shop owner before launch ---
  phoneDisplay: "+91-XXXXXXXXXX", // used for display / JSON-LD telephone
  whatsappNumber: "91XXXXXXXXXX", // digits only, no "+" — used for wa.me links
  addressLines: [
    "Shop Address Line 1",
    "Muzaffarnagar, Uttar Pradesh",
    "India",
  ],
  hours: "Mon–Sun: 10:00 AM – 8:00 PM", // typical furniture-store hours, confirm
} as const;

/** Base site URL (no trailing slash). Uses SITE_URL env in prod, sensible local default. */
export const SITE_URL: string = (
  process.env.SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

/** WhatsApp click-to-chat deep link (docs/CONVENTIONS.md, Project Scope §3). */
export function whatsappLink(message: string): string {
  return `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Form an absolute URL from a path (for canonical/OG tags). */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Default WhatsApp message used on the floating button. */
export const DEFAULT_WHATSAPP_MESSAGE =
  "Hello Pragati Furniture! I found your website and would like to know more.";