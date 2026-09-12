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
      <section className="bg-brand-primary-dark text-white">
        <div className="page-container py-20 text-center sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">
            Family-owned furniture store · {STORE.city}, {STORE.region}
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Quality wooden furniture for every Indian home
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">
            Hand-picked sofas, beds, dining sets and more. Built to last, priced
            honestly, and made right here in {STORE.city}.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={categories[0] ? `/products/${categories[0].slug}` : "/contact"}
              className="w-full rounded-md bg-brand-accent px-6 py-3 text-base font-semibold text-brand-primary-dark transition-colors hover:bg-brand-accent/90 sm:w-auto"
            >
              Browse furniture
            </Link>
            <a
              href={whatsappLink(`Hello ${STORE.name}! I'd like to know more about your furniture.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-md border border-white/30 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
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
            eyebrow="What we offer"
            title="Browse by category"
            description="Explore our range of furniture for every room in your home."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={{
                  name: cat.name,
                  slug: cat.slug,
                  description: cat.description,
                  productCount: cat._count.products,
                  imageUrl: cat.products[0]?.images[0]?.imageUrl ?? null,
                }}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Latest products ──────────────────────────── */}
      {latestProducts.length > 0 ? (
        <section className="bg-brand-surface py-16 sm:py-20">
          <div className="page-container">
            <SectionHeading
              eyebrow="Fresh in store"
              title="New arrivals"
              description="The latest pieces ready and waiting for you."
            />
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {latestProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    price: p.price === null ? null : Number(p.price),
                    shortDescription: p.shortDescription,
                    primaryImageUrl: p.images[0]?.imageUrl ?? null,
                    category: { name: p.category.name, slug: p.category.slug },
                  }}
                />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href={categories[0] ? `/products/${categories[0].slug}` : "/contact"}
                className="inline-block rounded-md border border-brand-primary px-6 py-3 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary hover:text-white"
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
          <div className="lg:col-span-2">
            <SectionHeading
              align="left"
              eyebrow="Why Pragati Furniture"
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
                    <p className="font-semibold text-brand-text">{item.title}</p>
                    <p className="text-sm text-brand-text-muted">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/about"
                className="inline-block rounded-md bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark"
              >
                More about us
              </Link>
            </div>
          </div>

          <aside className="rounded-xl border border-brand-border bg-brand-surface p-6">
            <h3 className="text-lg font-semibold text-brand-text">Visit our store</h3>
            <address className="mt-3 space-y-2 text-sm not-italic leading-6 text-brand-text-muted">
              {STORE.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <a href={`tel:${STORE.phoneDisplay.replace(/\s/g, "")}`} className="block font-semibold text-brand-primary hover:underline">
                {STORE.phoneDisplay}
              </a>
            </address>
            <p className="mt-4 text-sm text-brand-text-muted">Opening hours</p>
            <p className="text-sm font-semibold text-brand-text">{STORE.hours}</p>
            <a
              href={whatsappLink("Hello Pragati Furniture! I'd like to know more about your range.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block w-full rounded-md bg-brand-success px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-success/90"
            >
              Message us on WhatsApp
            </a>
            <div className="mt-2">
              <Link
                href="/contact"
                className="inline-block w-full rounded-md border border-brand-border px-4 py-2.5 text-center text-sm font-semibold text-brand-text transition-colors hover:bg-brand-bg"
              >
                Contact page & map
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}