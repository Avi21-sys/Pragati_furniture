// app/(public)/faq/page.tsx — Frequently Asked Questions page.
// ISR: revalidated ~1 hour (docs/SEO.md §3). Renders only ACTIVE FAQs in
// displayOrder and emits matching FAQPage JSON-LD — structured data must always
// match what's visible on the page, never hidden/inactive FAQs (SEO.md §5).
// Questions are phrased the way customers actually search (SEO.md §9).

import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { pageMetadata } from "@/lib/seo";
import { STORE, whatsappLink } from "@/lib/constants";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import SectionHeading from "@/components/public/SectionHeading";
import JsonLd from "@/components/public/JsonLd";
import RevealOnScroll from "@/components/public/RevealOnScroll";

export const revalidate = 3600; // 1 hour

export const metadata: Metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description:
    `Common questions about ${STORE.name}, ${STORE.city} — delivery, customization, ` +
    `materials, warranty, payment and visiting the store, answered.`,
  path: "/faq",
});

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({
    where: { isActive: true },
    orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
  });

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="page-container pb-16">
      <JsonLd data={faqJsonLd} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />

      <SectionHeading
        title="Frequently asked questions"
        description={`Straight answers to the questions customers ask ${STORE.name} most. Something else on your mind? Message us on WhatsApp.`}
      />

      {faqs.length === 0 ? (
        <div className="mt-12 text-center text-text-secondary">
          <p className="text-base">No FAQs yet — check back soon.</p>
        </div>
      ) : (
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {faqs.map((faq, i) => (
            <RevealOnScroll key={faq.id} delay={(i % 4) * 0.05}>
              <details className="group rounded-xl border border-brand-border bg-brand-surface open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-semibold text-text-primary [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  {/* Chevron — rotates when the panel is open */}
                  <svg
                    className="h-5 w-5 shrink-0 text-brand-primary transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="border-t border-brand-border px-5 py-4 text-sm leading-6 text-text-secondary sm:text-base sm:leading-7">
                  {faq.answer}
                </div>
              </details>
            </RevealOnScroll>
          ))}
        </div>
      )}

      {/* Still unsure → contact CTA */}
      <div className="mx-auto mt-12 max-w-2xl rounded-xl border border-brand-border bg-brand-cream-dark p-8 text-center">
        <h2 className="text-lg font-semibold text-text-primary">
          Couldn&apos;t find what you were looking for?
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Our store team is happy to help with anything not covered here.
        </p>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-semibold text-text-on-primary transition-colors hover:bg-brand-primary-dark"
          >
            Contact us
          </Link>
          <a
            href={whatsappLink(`Hello ${STORE.name}! I have a question about your furniture.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-brand-primary px-5 py-2.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary hover:text-text-on-primary"
          >
            Message on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}