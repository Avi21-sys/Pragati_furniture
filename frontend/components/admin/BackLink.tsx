// components/admin/BackLink.tsx — consistent "back" affordance for admin pages.
// Renders an inline link (client-safe, prefetches) with a leading arrow. Used
// at the top of every admin section so no page is a dead end.

import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function BackLink({ href, children }: Props) {
  return (
    <Link
      href={href}
      className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary transition-colors hover:underline hover:text-brand-primary-dark underline-offset-4"
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
      {children}
    </Link>
  );
}