// lib/slugify.ts — shared slug generation for categories and products.
// Applied by both the seed script and the admin API routes when a slug is not
// supplied, so URLs are clean and predictable (see docs/SEO.md §2).

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}