// components/public/CategoryPager.tsx — minimalist prev/next navigation between
// product categories: two sleek chevrons floating at the mid-height of the
// viewport edges. Server component — pure Links, stays ISR renderable. Arrows
// wrap around (last → first), in the header nav order (name asc).

import Link from "next/link";

type CategoryPagerProps = {
  categories: { name: string; slug: string }[];
  currentSlug: string;
};

export default function CategoryPager({ categories, currentSlug }: CategoryPagerProps) {
  const n = categories.length;
  if (n < 2) return null;

  const i = categories.findIndex((c) => c.slug === currentSlug);
  if (i === -1) return null;

  const prev = categories[(i - 1 + n) % n];
  const next = categories[(i + 1) % n];

  return (
    <>
      {/* Previous category — fixed to the left edge, vertically centred */}
      <Link
        href={`/products/${prev.slug}`}
        aria-label={`Previous category: ${prev.name}`}
        className="group fixed left-2 top-1/2 z-30 -translate-y-1/2 print:hidden sm:left-3"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-brand-surface/80 text-text-secondary opacity-60 shadow-sm backdrop-blur-md transition-all duration-200 group-hover:border-brand-accent group-hover:text-brand-primary group-hover:opacity-100 group-focus-visible:border-brand-accent group-focus-visible:text-brand-primary sm:h-11 sm:w-11">
          <ChevronLeft className="h-5 w-5" />
        </span>
      </Link>

      {/* Next category — fixed to the right edge, vertically centred */}
      <Link
        href={`/products/${next.slug}`}
        aria-label={`Next category: ${next.name}`}
        className="group fixed right-2 top-1/2 z-30 -translate-y-1/2 print:hidden sm:right-3"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-brand-surface/80 text-text-secondary opacity-60 shadow-sm backdrop-blur-md transition-all duration-200 group-hover:border-brand-accent group-hover:text-brand-primary group-hover:opacity-100 group-focus-visible:border-brand-accent group-focus-visible:text-brand-primary sm:h-11 sm:w-11">
          <ChevronRight className="h-5 w-5" />
        </span>
      </Link>
    </>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}