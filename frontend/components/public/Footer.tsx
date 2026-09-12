// components/public/Footer.tsx — site footer with business info + quick links.

import Link from "next/link";
import { STORE, whatsappLink } from "@/lib/constants";
import type { HeaderCategory } from "./Header";

export default function Footer({ categories }: { categories: HeaderCategory[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-brand-primary-dark text-white">
      <div className="page-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Business */}
        <div>
          <h2 className="text-lg font-semibold">{STORE.name}</h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Quality wooden furniture for every home, made to last. Visit us in{" "}
            {STORE.city}, {STORE.region}.
          </p>
          <address className="mt-4 text-sm not-italic leading-6 text-white/70">
            {STORE.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <span className="mt-2 block text-white/90">{STORE.phoneDisplay}</span>
          </address>
        </div>

        {/* Explore */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/" className="text-white/80 hover:text-white">Home</Link>
            </li>
            <li>
              <Link href="/about" className="text-white/80 hover:text-white">About us</Link>
            </li>
            <li>
              <Link href="/contact" className="text-white/80 hover:text-white">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">Categories</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/products/${cat.slug}`} className="text-white/80 hover:text-white">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Reach us */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">Reach us</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <span className="text-white/70">Opening hours</span>
              <p className="mt-1 text-white/90">{STORE.hours}</p>
            </li>
            <li>
              <a
                href={whatsappLink(`Hello ${STORE.name}! I'd like to ask about your furniture.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md bg-brand-success px-4 py-2 font-semibold text-white transition-colors hover:bg-brand-success/90"
              >
                Chat on WhatsApp
              </a>
            </li>
            <li>
              <Link href="/contact" className="text-white/80 underline hover:text-white">
                Send us an enquiry
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="page-container flex flex-col items-center justify-between gap-2 text-xs text-white/50 sm:flex-row">
          <p>
            © {year} {STORE.name}, {STORE.city}. All rights reserved.
          </p>
          <p>Made with care in {STORE.city}, India.</p>
        </div>
      </div>
    </footer>
  );
}