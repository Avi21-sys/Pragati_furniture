// app/sitemap.ts — auto-generated sitemap.xml (docs/SEO.md §6).
// Lists static pages, the FAQ page, every category, and every active product.
// Regenerated on each deploy (and revalidated as Next rebuilds ISR/static routes).

import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;

  const faqs = await prisma.faq.findMany({
    where: { isActive: true },
    select: { updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 1,
  });

  const staticEntries: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    {
      url: `${base}/faq`,
      lastModified: faqs[0]?.updatedAt ?? new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  });
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, category: { select: { slug: true } }, updatedAt: true },
  });

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${base}/products/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/products/${product.category.slug}/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}