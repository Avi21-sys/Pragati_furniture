// app/(public)/about/page.tsx — About page. SSG (static).

import Link from "next/link";
import { STORE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import SectionHeading from "@/components/public/SectionHeading";

export const metadata = pageMetadata({
  title: "About Us",
  description: `Learn about ${STORE.name}, a trusted furniture store in ${STORE.city}, ${STORE.region}, India — solid wood furniture built to last.`,
  path: "/about",
});

const values = [
  {
    title: "Solid wood, honestly priced",
    text: "We build and stock furniture from quality sheesham and teak. No particle-board tricks, no inflated margins.",
  },
  {
    title: "Made for the way you live",
    text: "Strong joinery, comfortable shapes and finishes that survive daily use — and Indian weather.",
  },
  {
    title: "A shop, not just a warehouse",
    text: "Visit us in person, sit on the sofa, check the joints. Our team will happily walk you through every piece.",
  },
  {
    title: "Custom work on request",
    text: "Need a bigger wardrobe or a table to fit a specific corner? We make items to order.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="bg-brand-primary-dark py-16 text-white sm:py-20">
        <div className="page-container max-w-3xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            About {STORE.name}
          </h1>
          <p className="mt-4 text-lg text-white/80">
            A family-run furniture store in {STORE.city}, {STORE.region} — selling
            quality wooden furniture since day one, built on trust and referrals.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="page-container py-16">
        <div className="mx-auto max-w-3xl">
          <SectionHeading align="left" eyebrow="Our story" title="Furniture you can trust, from people you know" />
          <div className="mt-6 space-y-4 leading-7 text-brand-text-muted">
            <p>
              {STORE.name} started in {STORE.city} with a simple belief: a home
              deserves furniture that lasts. What we sell isn&apos;t chosen for
              how it photographs — it&apos;s chosen for how it feels in your living
              room, how it survives years of family meals, and how easily it
              becomes part of your everyday life.
            </p>
            <p>
              Today we stock {STORE.city}&apos;s residents with sofas, beds, dining
              sets, wardrobes and chairs in solid wood — and we&apos;re proud that
              most of our business still comes from word of mouth and repeat
              customers.
            </p>
            <p>
              Whether you&apos;re furnishing a new home or replacing one tired
              piece, we&apos;d love you to visit the store, take your time, and
              find the furniture that fits your home.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-brand-surface py-16">
        <div className="page-container">
          <SectionHeading eyebrow="What we stand for" title="The Pragati promise" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="rounded-xl border border-brand-border bg-brand-bg p-6">
                <h3 className="text-lg font-semibold text-brand-text">{value.title}</h3>
                <p className="mt-2 text-sm leading-6 text-brand-text-muted">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA to catalogue */}
      <section className="page-container py-16 text-center">
        <h2 className="text-2xl font-semibold text-brand-text">Come see our furniture in person</h2>
        <p className="mx-auto mt-3 max-w-xl text-brand-text-muted">
          Browse the catalogue online, then visit us in {STORE.city} to see and touch
          the real thing.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="w-full rounded-md bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark sm:w-auto"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="w-full rounded-md border border-brand-primary px-6 py-3 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary hover:text-white sm:w-auto"
          >
            Contact & directions
          </Link>
        </div>
      </section>
    </div>
  );
}