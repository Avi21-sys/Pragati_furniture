// app/(public)/products/[category]/[product]/page.tsx — product detail page.
// ISR: revalidated ~1 hour (docs/SEO.md §3). Carries Product JSON-LD; the
// frontend URL nests the category for topical structure (SEO.md §2 note), so
// any mismatched category slug is 301-redirected to the canonical URL.

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { pageMetadata } from "@/lib/seo";
import { STORE, whatsappLink, absoluteUrl } from "@/lib/constants";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import ProductGallery from "@/components/public/ProductGallery";
import EnquiryForm from "@/components/public/EnquiryForm";
import JsonLd from "@/components/public/JsonLd";
import { formatPrice } from "@/components/public/ProductCard";

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

  const price = product.price === null ? null : Number(product.price);

  // JSON-LD: omit the offers block for "price on request" items (docs/SEO.md §5).
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
  if (price !== null) {
    productJsonLd.offers = {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/products/${product.category.slug}/${product.slug}`),
    };
  }

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
          <p className="text-sm font-medium uppercase tracking-wide text-brand-accent">
            {product.category.name}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-brand-text sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-4 text-2xl font-bold text-brand-primary-dark">
            {formatPrice(price)}
          </p>

          {product.shortDescription ? (
            <p className="mt-4 text-base leading-7 text-brand-text-muted">
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
            className="mt-6 flex items-center justify-center gap-2 rounded-md bg-brand-success px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-success/90"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat about this product
          </a>

          <div className="mt-8 border-t border-brand-border pt-8">
            <h2 className="text-lg font-semibold text-brand-text">Send an enquiry</h2>
            <p className="mt-1 mb-5 text-sm text-brand-text-muted">
              Tell us more and we'll call you back with details and the best price.
            </p>
            <EnquiryForm productId={product.id} productName={product.name} />
          </div>
        </div>
      </div>
    </div>
  );
}