// components/public/ProductCard.tsx — grid card for a product.
// Links to /products/{category-slug}/{product-slug} (docs/SEO.md §2).

import Image from "next/image";
import Link from "next/link";

export type ProductCardData = {
  id: number;
  name: string;
  slug: string;
  price: number | null;
  shortDescription?: string | null;
  primaryImageUrl?: string | null;
  category: { name: string; slug: string };
};

export function formatPrice(price: number | null): string {
  return price === null ? "Contact for price" : `₹${price.toLocaleString("en-IN")}`;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/products/${product.category.slug}/${product.slug}`}
      className="group overflow-hidden rounded-xl border border-brand-border bg-brand-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-bg">
        {product.primaryImageUrl ? (
          <Image
            src={product.primaryImageUrl}
            alt={`${product.name}, ${product.category.name} at Pragati Furniture`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-text-muted">
            <svg className="h-12 w-12 text-brand-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-accent">
          {product.category.name}
        </p>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold text-brand-text group-hover:text-brand-primary">
          {product.name}
        </h3>
        <p className="mt-2 text-sm font-semibold text-brand-primary-dark">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}