// app/(public)/products/[category]/page.tsx — category listing page.
// ISR: revalidated ~1 hour (docs/SEO.md §3). Includes a unique category
// description (stored in DB) which doubles as page meta (SEO.md §9).

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { pageMetadata, fallbackCategoryDescription } from "@/lib/seo";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import ProductCard from "@/components/public/ProductCard";
import CategoryPager from "@/components/public/CategoryPager";
import { StaggerGroup, StaggerItem } from "@/components/public/StaggerGrid";

export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });
  return categories.map((c) => ({ category: c.slug }));
}

type PageProps = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = await prisma.category.findUnique({ where: { slug: category } });
  if (!cat) return {};
  return pageMetadata({
    title: cat.name,
    description:
      cat.description ??
      fallbackCategoryDescription(cat.name),
    path: `/products/${cat.slug}`,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  const [cat, products, categories] = await Promise.all([
    prisma.category.findUnique({ where: { slug: category } }),
    prisma.product.findMany({
      where: { isActive: true, category: { slug: category } },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: { orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }], take: 1 },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    }),
  ]);

  if (!cat) notFound();

  const description =
    cat.description ?? fallbackCategoryDescription(cat.name);

  return (
    <div className="page-container pb-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: cat.name }]} />

      {/* Prev/next category navigation */}
      <CategoryPager categories={categories} currentSlug={cat.slug} />

      {/* Category header + SEO description */}
      <div className="max-w-3xl border-b border-brand-border pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          {cat.name}
        </h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">{description}</p>
        <p className="mt-2 text-sm font-medium uppercase tracking-wide text-text-secondary">
          {products.length} product{products.length === 1 ? "" : "s"}
        </p>
      </div>

      {products.length > 0 ? (
        <StaggerGroup className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <StaggerItem key={p.id} hoverLift>
              <ProductCard
                product={{
                  id: p.id,
                  name: p.name,
                  slug: p.slug,
                  shortDescription: p.shortDescription,
                  primaryImageUrl: p.images[0]?.imageUrl ?? null,
                  category: { name: cat.name, slug: cat.slug },
                }}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      ) : (
        <div className="mt-12 text-center text-text-secondary">
          <p className="text-lg font-medium text-text-primary">
            No items in this category yet.
          </p>
          <p className="mt-1 text-sm">New pieces are on their way — check back soon or message us to know more.</p>
        </div>
      )}
    </div>
  );
}