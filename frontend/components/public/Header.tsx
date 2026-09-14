// components/public/Header.tsx — sticky site header with category navigation.
// Deep-olive band, cream text and logo (docs/DESIGN.md §5). Client component
// only for the mobile menu toggle + active-link highlighting; data (categories)
// is passed in from the server layout. Docs: SEO.md §2.

"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { STORE, whatsappLink } from "@/lib/constants";

export type HeaderCategory = {
  name: string;
  slug: string;
};

export default function Header({ categories }: { categories: HeaderCategory[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-brand-primary text-text-on-primary shadow-sm">
      <div className="page-container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-cream font-heading text-base font-semibold text-brand-primary">
            pf
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight text-text-on-primary">
            Pragati <span className="text-brand-accent">Furniture</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          <NavLink href="/" active={isActive("/")}>
            Home
          </NavLink>
          {categories.map((cat) => (
            <NavLink
              key={cat.slug}
              href={`/products/${cat.slug}`}
              active={isActive(`/products/${cat.slug}`)}
            >
              {cat.name}
            </NavLink>
          ))}
          <NavLink href="/about" active={isActive("/about")}>
            About
          </NavLink>
          <NavLink href="/faq" active={isActive("/faq")}>
            FAQ
          </NavLink>
          <NavLink href="/contact" active={isActive("/contact")}>
            Contact
          </NavLink>
        </nav>

        <div className="hidden md:block">
          <a
            href={whatsappLink(`Hello ${STORE.name}! I'd like to know more about your furniture.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-cream px-4 py-2 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-cream-dark"
          >
            <WhatsAppIcon className="h-4 w-4 text-brand-success" />
            WhatsApp
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-text-on-primary md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open ? (
        <nav className="border-t border-black/10 bg-brand-primary md:hidden" aria-label="Mobile navigation">
          <div className="page-container flex flex-col py-3">
            <MobileLink href="/" onNavigate={() => setOpen(false)} active={isActive("/")}>
              Home
            </MobileLink>
            <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-text-on-primary/60">
              Categories
            </p>
            {categories.map((cat) => (
              <MobileLink
                key={cat.slug}
                href={`/products/${cat.slug}`}
                onNavigate={() => setOpen(false)}
                active={isActive(`/products/${cat.slug}`)}
              >
                {cat.name}
              </MobileLink>
            ))}
            <MobileLink href="/about" onNavigate={() => setOpen(false)} active={isActive("/about")}>
              About
            </MobileLink>
            <MobileLink href="/faq" onNavigate={() => setOpen(false)} active={isActive("/faq")}>
              FAQ
            </MobileLink>
            <MobileLink href="/contact" onNavigate={() => setOpen(false)} active={isActive("/contact")}>
              Contact
            </MobileLink>
            <div className="px-3 pt-4">
              <a
                href={whatsappLink(`Hello ${STORE.name}! I'd like to know more about your furniture.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-cream px-4 py-2.5 text-sm font-semibold text-brand-primary"
              >
                <WhatsAppIcon className="h-4 w-4 text-brand-success" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`text-sm font-medium transition-colors ${
        active
          ? "text-text-on-primary underline decoration-brand-accent decoration-2 underline-offset-[6px]"
          : "text-text-on-primary/75 hover:text-text-on-primary"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  children,
  active,
  onNavigate,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
        active ? "bg-brand-cream text-brand-primary" : "text-text-on-primary/90 hover:bg-black/10"
      }`}
    >
      {children}
    </Link>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}