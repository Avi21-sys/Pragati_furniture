// components/public/CategoryCard.tsx — grid card linking to a category listing.

import Image from "next/image";
import Link from "next/link";

export type CategoryCardData = {
  name: string;
  slug: string;
  description?: string | null;
  productCount: number;
  /** Representative cover image (first active product's primary image). */
  imageUrl?: string | null;
};

export default function CategoryCard({ category }: { category: CategoryCardData }) {
  return (
    <Link
      href={`/products/${category.slug}`}
      className="group h-full overflow-hidden rounded-xl border border-brand-border bg-brand-surface shadow-sm"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-bg">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={`${category.name} at Pragati Furniture, Muzaffarnagar`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-heading text-5xl font-semibold text-brand-primary-light/60">pf</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-text-primary group-hover:text-brand-primary">
          {category.name}
        </h3>
        {category.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{category.description}</p>
        ) : null}
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
          {category.productCount} product{category.productCount === 1 ? "" : "s"}
        </p>
      </div>
    </Link>
  );
}