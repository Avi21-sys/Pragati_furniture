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
      className="group overflow-hidden rounded-xl border border-brand-border bg-brand-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
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
            <span className="text-5xl font-bold text-brand-border">PF</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-brand-text group-hover:text-brand-primary">
          {category.name}
        </h3>
        {category.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-brand-text-muted">{category.description}</p>
        ) : null}
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-brand-accent">
          {category.productCount} product{category.productCount === 1 ? "" : "s"}
        </p>
      </div>
    </Link>
  );
}