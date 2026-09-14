// app/(public)/products/[category]/[product]/page.tsx — product detail page.
// ISR: revalidated ~1 hour (docs/SEO.md §3). Carries Product JSON-LD; the
// frontend URL nests the category for topical structure (SEO.md §2 note), so
// any mismatched category slug is 301-redirected to the canonical URL.

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { pageMetadata } from "@/lib/seo";
import { STORE, whatsappLink } from "@/lib/constants";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import ProductGallery from "@/components/public/ProductGallery";
import EnquiryForm from "@/components/public/EnquiryForm";
import JsonLd from "@/components/public/JsonLd";
import { WhatsAppIcon } from "@/components/public/Header";

export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      category: { select: { slug: true } },
    },
  });
  return products.map((product) => ({
    category: product.category.slug,
    product: product.slug,
  }));
}

type PageProps = { params: Promise<{ category: string; product: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { product: slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: { category: true, images: { orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }] } },
  });
  if (!product) return {};
  const primaryImage = product.images[0];
  return pageMetadata({
    title: product.name,
    description:
      product.shortDescription ??
      `${product.name} available at ${STORE.name}, ${STORE.city}. Visit our store or enquire online.`,
    path: `/products/${product.category.slug}/${product.slug}`,
    image: primaryImage?.imageUrl,
    type: "product",
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { category, product: slug } = await params;

  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }] },
    },
  });

  if (!product) notFound();

  // Canonical URL nests under the true category (docs/SEO.md §2 note) — if a
  // legacy/wrong category slug was used, 301 to the canonical URL.
  if (category !== product.category.slug) {
    redirect(`/products/${product.category.slug}/${product.slug}`);
  }

  // JSON-LD: the `offers` block is NEVER included, for any product — prices
  // are never shown publicly, and structured data must match the visible page
  // (docs/SEO.md §5 FINAL DECISION).
  const productJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((img) => img.imageUrl),
    description:
      product.shortDescription ??
      `${product.name} from ${STORE.name}, ${STORE.city}.`,
    brand: { "@type": "Brand", name: STORE.name },
  };

  return (
    <div className="page-container pb-16">
      <JsonLd data={productJsonLd} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: product.category.name, href: `/products/${product.category.slug}` },
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        {/* Gallery */}
        <ProductGallery
          images={product.images.map((img) => ({
            id: img.id,
            imageUrl: img.imageUrl,
            displayOrder: img.displayOrder,
            isPrimary: img.isPrimary,
          }))}
          productName={product.name}
        />

        {/* Info + enquiry */}
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-text-secondary">
            {product.category.name}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            {product.name}
          </h1>

          {product.shortDescription ? (
            <p className="mt-4 text-base leading-7 text-text-secondary">
              {product.shortDescription}
            </p>
          ) : null}

          {/* WhatsApp CTA */}
          <a
            href={whatsappLink(
              `Hello ${STORE.name}! I'm interested in "${product.name}". Please share more details and the price.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 flex items-center justify-center gap-2 rounded-lg bg-brand-success px-4 py-3 text-base font-semibold text-text-on-primary hover:bg-brand-primary-light"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Chat about this product
          </a>

          <div className="mt-8 border-t border-brand-border pt-8">
            <h2 className="text-lg font-semibold text-text-primary">Send an enquiry</h2>
            <p className="mt-1 mb-5 text-sm text-text-secondary">
              Tell us more and we'll call you back with details and the best price.
            </p>
            <EnquiryForm productId={product.id} productName={product.name} />
          </div>
        </div>
      </div>
    </div>
  );
}