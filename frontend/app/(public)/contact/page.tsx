// app/(public)/contact/page.tsx — Contact page. SSG.
// Enquiry form + store details + embedded map + LocalBusiness JSON-LD
// (docs/SEO.md §5 & §7 — local SEO is the highest-priority channel here).

import { STORE, whatsappLink } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import SectionHeading from "@/components/public/SectionHeading";
import EnquiryForm from "@/components/public/EnquiryForm";
import JsonLd from "@/components/public/JsonLd";

export const metadata = pageMetadata({
  title: "Contact Us",
  description: `Contact ${STORE.name} in ${STORE.city}, ${STORE.region}. Call us, message on WhatsApp, or send an enquiry online. Visit our store to see the full range.`,
  path: "/contact",
});

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  name: STORE.name,
  description: `Furniture store in ${STORE.city}, ${STORE.region}, India.`,
  address: {
    "@type": "PostalAddress",
    streetAddress: STORE.addressLines[0],
    addressLocality: STORE.city,
    addressRegion: STORE.region,
    addressCountry: STORE.country,
  },
  telephone: STORE.phoneDisplay,
  openingHours: "Mo-Su 10:00-20:00",
};

// Escape hatch: drop a real Google Map embed URL here once the address is final.
const MAP_EMBED_URL =
  "https://www.google.com/maps?q=" +
  encodeURIComponent(`${STORE.name} ${STORE.city}`) +
  "&output=embed";

export default function ContactPage() {
  return (
    <div className="pb-16">
      <JsonLd data={localBusinessJsonLd} />

      <section className="bg-brand-primary-dark py-14 text-white">
        <div className="page-container max-w-3xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Contact us</h1>
          <p className="mt-3 text-lg text-white/80">
            Have a question or ready to buy? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <div className="page-container grid gap-10 py-16 lg:grid-cols-2">
        {/* Left: details + form */}
        <div>
          {/* Contact cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-brand-border bg-brand-surface p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-accent">Call us</h2>
              <a
                href={`tel:${STORE.phoneDisplay.replace(/\s/g, "")}`}
                className="mt-2 block text-lg font-semibold text-brand-text hover:text-brand-primary"
              >
                {STORE.phoneDisplay}
              </a>
              <p className="mt-1 text-sm text-brand-text-muted">{STORE.hours}</p>
            </div>

            <div className="rounded-xl border border-brand-border bg-brand-surface p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-accent">WhatsApp</h2>
              <a
                href={whatsappLink("Hello Pragati Furniture! I'd like to ask about your furniture.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block rounded-md bg-brand-success px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-success/90"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="rounded-xl border border-brand-border bg-brand-surface p-5 sm:col-span-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-accent">Visit the store</h2>
              <address className="mt-2 text-sm not-italic leading-6 text-brand-text">
                {STORE.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <p className="mt-2 text-sm text-brand-text-muted">{STORE.hours}</p>
            </div>
          </div>

          {/* Enquiry form */}
          <div className="mt-8 rounded-xl border border-brand-border bg-brand-surface p-6">
            <SectionHeading align="left" eyebrow="Send an enquiry" title="We'll get back to you" />
            <div className="mt-6">
              <EnquiryForm />
            </div>
          </div>
        </div>

        {/* Right: map */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-brand-text">Find us on the map</h2>
          <div className="overflow-hidden rounded-xl border border-brand-border">
            <iframe
              title="Map showing the location of Pragati Furniture, Muzaffarnagar"
              src={MAP_EMBED_URL}
              width="100%"
              height="420"
              loading="lazy"
              style={{ border: 0 }}
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <p className="text-sm text-brand-text-muted">
            Exact address and map pin need confirmation with the shop owner before launch.
          </p>
        </div>
      </div>
    </div>
  );
}