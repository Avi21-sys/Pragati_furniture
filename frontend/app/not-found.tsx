// app/not-found.tsx — friendly 404 for the public site.

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-brand-accent">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-brand-text">
        That page couldn&apos;t be found
      </h1>
      <p className="mt-2 max-w-md text-brand-text-muted">
        It may have moved, or the link is outdated. Head back home and browse our
        current range instead.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark"
      >
        Back to home
      </Link>
    </div>
  );
}