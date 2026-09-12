// lib/seo.ts — build Metadata objects for public pages.
// Every public page needs a unique <title>, description, Open Graph + canonical
// URL (docs/SEO.md §4). This central helper keeps that consistent.

import type { Metadata } from "next";
import { STORE, absoluteUrl } from "./constants";

const titleBase = `Pragati Furniture, ${STORE.city}`;

/** Standard `<title>` format: "{Name} | Pragati Furniture, Muzaffarnagar". */
export function pageTitle(name: string): string {
  return `${name} | ${titleBase}`;
}

export type SeoOptions = {
  title: string; // page-specific name — will be appended with the standard suffix
  description: string;
  path: string; // route path, e.g. "/products/sofas"
  /** Absolute image URL used for og:image (e.g. a primary product photo). */
  image?: string;
  type?: "website" | "article" | "product";
};

export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: SeoOptions): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ? absoluteUrl(image) : undefined;

  return {
    title: pageTitle(title),
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      title: pageTitle(title),
      description,
      url,
      siteName: STORE.name,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] } : {}),
      locale: "en_IN",
      countryName: STORE.country,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: pageTitle(title),
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

/**
 * Shared category description builders used behind the scenes — every category
 * keeps a unique ~100-150 word description (docs/SEO.md §9). Most are stored in
 * the DB via the admin panel; `fallbackCategoryDescription` is only a last resort
 * for categories a busy owner created without one.
 */
export function fallbackCategoryDescription(categoryName: string): string {
  return (
    `Browse ${categoryName} available at ${STORE.name} in ${STORE.city}, ${STORE.region}. ` +
    `Visit our store to see ${categoryName.toLowerCase()} in person, or send an enquiry ` +
    `online and we'll get back to you quickly.`
  );
}