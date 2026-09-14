// components/public/Footer.tsx — site footer with business info + quick links.
// Deep-olive band, cream-on-dark text (docs/DESIGN.md §5).

import Link from "next/link";
import { STORE, whatsappLink } from "@/lib/constants";
import RevealOnScroll from "./RevealOnScroll";
import type { HeaderCategory } from "./Header";

export default function Footer({ categories }: { categories: HeaderCategory[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-brand-primary-dark text-text-on-primary">
      <div className="page-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Business */}
        <RevealOnScroll>
          <h2 className="font-heading text-lg font-semibold">{STORE.name}</h2>
          <p className="mt-3 text-sm leading-6 text-text-on-primary/70">
            Quality wooden furniture for every home, made to last. Visit us in{" "}
            {STORE.city}, {STORE.region}.
          </p>
          <address className="mt-4 text-sm not-italic leading-6 text-text-on-primary/70">
            {STORE.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <span className="mt-2 block text-text-on-primary/90">{STORE.phoneDisplay}</span>
          </address>
        </RevealOnScroll>

        {/* Explore */}
        <RevealOnScroll>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-on-primary/50">
            Explore
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/" className="text-text-on-primary/80 hover:text-text-on-primary">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-text-on-primary/80 hover:text-text-on-primary">
                About us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-text-on-primary/80 hover:text-text-on-primary">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-text-on-primary/80 hover:text-text-on-primary">
                FAQs
              </Link>
            </li>
          </ul>
        </RevealOnScroll>

        {/* Categories */}
        <RevealOnScroll>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-on-primary/50">
            Categories
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/products/${cat.slug}`} className="text-text-on-primary/80 hover:text-text-on-primary">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </RevealOnScroll>

        {/* Reach us */}
        <RevealOnScroll>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-on-primary/50">
            Reach us
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <span className="text-text-on-primary/70">Opening hours</span>
              <p className="mt-1 text-text-on-primary/90">{STORE.hours}</p>
            </li>
            <li>
              <a
                href={whatsappLink(`Hello ${STORE.name}! I'd like to ask about your furniture.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block rounded-lg bg-brand-success px-4 py-2 font-semibold text-text-on-primary hover:bg-brand-primary-light"
              >
                Chat on WhatsApp
              </a>
            </li>
            <li>
              <Link href="/contact" className="text-text-on-primary/80 underline underline-offset-4 hover:text-text-on-primary">
                Send us an enquiry
              </Link>
            </li>
          </ul>
        </RevealOnScroll>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="page-container flex flex-col items-center justify-between gap-2 text-xs text-text-on-primary/50 sm:flex-row">
          <p>
            © {year} {STORE.name}, {STORE.city}. All rights reserved.
          </p>
          <p>Made with care in {STORE.city}, India.</p>
        </div>
      </div>
    </footer>
  );
}