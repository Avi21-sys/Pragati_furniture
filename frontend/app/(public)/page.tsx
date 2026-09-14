// app/(public)/page.tsx — Home page. SSG (static, built once).
// Shows categories, latest products and business highlights. Carries
// LocalBusiness JSON-LD (docs/SEO.md §5).

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { STORE, whatsappLink } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import SectionHeading from "@/components/public/SectionHeading";
import CategoryCard from "@/components/public/CategoryCard";
import ProductCard from "@/components/public/ProductCard";
import JsonLd from "@/components/public/JsonLd";
import RevealOnScroll from "@/components/public/RevealOnScroll";
import { StaggerGroup, StaggerItem } from "@/components/public/StaggerGrid";
export const metadata = pageMetadata({
  title: "Quality Wooden Furniture in Muzaffarnagar",
  description:
    "Pragati Furniture in Muzaffarnagar sells quality wooden sofas, beds, dining sets, wardrobes and chairs. Visit our store or enquire online today.",
  path: "/",
});

export default async function HomePage() {
  const [categories, latestProducts] = await Promise.all([
    // Categories with active-product count + a representative cover image.
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        products: {
          where: { isActive: true },
          select: {
            images: { orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }], take: 1 },
          },
          take: 1,
        },
        _count: { select: { products: { where: { isActive: true } } } },
      },
    }),
    // Latest active products for the "new arrivals" strip.
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        category: true,
        images: { orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }], take: 1 },
      },
    }),
  ]);

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: STORE.name,
    description:
      "Quality wooden furniture shop in Muzaffarnagar, Uttar Pradesh, India.",
    address: {
      "@type": "PostalAddress",
      addressLocality: STORE.city,
      addressRegion: STORE.region,
      addressCountry: STORE.country,
    },
    telephone: STORE.phoneDisplay,
  };

  return (
    <>
      <JsonLd data={localBusinessJsonLd} />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="bg-brand-primary-dark text-text-on-primary">
        <div className="page-container py-20 text-center sm:py-28">
          <h1 className="text-2xl font-bold leading-snug tracking-tight text-text-on-primary sm:text-4xl sm:leading-tight">
            Quality wooden furniture for every Indian home
          </h1>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-brand-accent" aria-hidden="true" />
          <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-text-on-primary/85 sm:text-base sm:leading-7">
            A family-run furniture store in {STORE.city}, {STORE.region} — hand-picked
            sofas, beds, dining sets and more. Built to last, priced honestly.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={categories[0] ? `/products/${categories[0].slug}` : "/contact"}
              className="btn-primary w-full rounded-lg bg-brand-cream px-6 py-3 text-base font-semibold text-brand-primary hover:bg-brand-cream-dark sm:w-auto"
            >
              Browse furniture
            </Link>
            <a
              href={whatsappLink(`Hello ${STORE.name}! I'd like to know more about your furniture.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-lg border border-text-on-primary/30 px-6 py-3 text-base font-semibold text-text-on-primary transition-colors hover:bg-black/10 sm:w-auto"
            >
              Chat with us
            </a>
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────── */}
      {categories.length > 0 ? (
        <section className="page-container py-16 sm:py-20">
          <SectionHeading
            title="Browse by category"
            description="Explore our range of furniture for every room in your home."
          />
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <StaggerItem key={cat.id} hoverLift>
                <CategoryCard
                  category={{
                    name: cat.name,
                    slug: cat.slug,
                    description: cat.description,
                    productCount: cat._count.products,
                    imageUrl: cat.products[0]?.images[0]?.imageUrl ?? null,
                  }}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      ) : null}

      {/* ── Latest products ──────────────────────────── */}
      {latestProducts.length > 0 ? (
        <section className="bg-brand-cream-dark py-16 sm:py-20">
          <div className="page-container">
            <SectionHeading
              title="New arrivals"
              description="The latest pieces ready and waiting for you."
            />
            <StaggerGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestProducts.map((p) => (
                <StaggerItem key={p.id} hoverLift>
                  <ProductCard
                    product={{
                      id: p.id,
                      name: p.name,
                      slug: p.slug,
                      shortDescription: p.shortDescription,
                      primaryImageUrl: p.images[0]?.imageUrl ?? null,
                      category: { name: p.category.name, slug: p.category.slug },
                    }}
                  />
                </StaggerItem>
              ))}
            </StaggerGroup>
            <div className="mt-10 text-center">
              <Link
                href={categories[0] ? `/products/${categories[0].slug}` : "/contact"}
                className="inline-block rounded-lg border border-brand-primary px-6 py-3 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary hover:text-text-on-primary"
              >
                See the full range
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Why us teaser ────────────────────────────── */}
      <section className="page-container py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-3">
          <RevealOnScroll className="lg:col-span-2">
            <SectionHeading
              align="left"
              title="Furniture that works as hard as you do"
              description={`For years, ${STORE.city} families have trusted us with their homes. Every sofa, bed and dining set is chosen for honest materials, strong construction and a fair price — and if you need something special, we make it to order.`}
            />
            <ul className="mt-8 space-y-4">
              {[
                { title: "Solid wood, not shortcuts", text: "Durable sheesham and teak construction that lasts for generations." },
                { title: "Made to order", text: "Need a custom size or finish? We build what your home needs." },
                { title: "Honest local prices", text: "No middlemen, no inflated showroom margins—just fair local pricing." },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-accent" />
                  <div>
                    <p className="font-semibold text-text-primary">{item.title}</p>
                    <p className="text-sm text-text-secondary">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/about"
                className="btn-primary inline-block rounded-lg bg-brand-primary px-6 py-3 text-sm font-semibold text-text-on-primary hover:bg-brand-primary-dark"
              >
                More about us
              </Link>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <aside className="rounded-xl border border-brand-border bg-brand-surface p-6">
            <h3 className="text-lg font-semibold text-text-primary">Visit our store</h3>
            <address className="mt-3 space-y-2 text-sm not-italic leading-6 text-text-secondary">
              {STORE.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <a href={`tel:${STORE.phoneDisplay.replace(/\s/g, "")}`} className="block font-semibold text-brand-primary hover:underline">
                {STORE.phoneDisplay}
              </a>
            </address>
            <p className="mt-4 text-sm text-text-secondary">Opening hours</p>
            <p className="text-sm font-semibold text-text-primary">{STORE.hours}</p>
            <a
              href={whatsappLink("Hello Pragati Furniture! I'd like to know more about your range.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-5 inline-block w-full rounded-lg bg-brand-success px-4 py-2.5 text-center text-sm font-semibold text-text-on-primary hover:bg-brand-primary-light"
            >
              Message us on WhatsApp
            </a>
            <div className="mt-2">
              <Link
                href="/contact"
                className="inline-block w-full rounded-lg border border-brand-border px-4 py-2.5 text-center text-sm font-semibold text-text-primary transition-colors hover:bg-brand-bg"
              >
                Contact page & map
              </Link>
            </div>
          </aside>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}