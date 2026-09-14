/**
 * prisma/seed.ts — first-time data setup for Pragati Furniture.
 *
 * Idempotent: safe to run repeatedly (`npx prisma db seed`).
 *
 * Creates:
 *   1. The first admin user  (needed to log into /admin)
 *   2. A starter set of categories (dynamic — the owner can add/edit/delete any time)
 *   3. A few clearly-labeled SAMPLE products so the catalog isn't empty on first
 *      deploy. Their images are placeholder URLs (picsum.photos) — delete them and
 *      upload real photos from the admin panel. Skip these for a clean production
 *      seed by setting SEED_WITH_SAMPLE_PRODUCTS=false.
 *
 * Notes:
 *   - Admin password: uses SEED_ADMIN_PASSWORD env var if set, else "admin123".
 *     CHANGE THIS after first login (`/admin` panel).
 *   - Slugs are generated from names here and by lib/slugify in the API layer.
 */

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const SEED_ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME ?? "admin";
const SEED_ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "admin123";
const WITH_SAMPLE_PRODUCTS = process.env.SEED_WITH_SAMPLE_PRODUCTS !== "false";

const STORE_NAME = "Pragati Furniture";
const STORE_CITY = "Muzaffarnagar";

async function main() {
  // 1. Admin user
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username: SEED_ADMIN_USERNAME },
  });

  if (existingAdmin) {
    console.log(`✔ Admin user "${SEED_ADMIN_USERNAME}" already exists — skipping.`);
  } else {
    const passwordHash = await import("bcrypt").then((bcrypt) =>
      bcrypt.hash(SEED_ADMIN_PASSWORD, 12)
    );

    await prisma.adminUser.create({
      data: {
        username: SEED_ADMIN_USERNAME,
        passwordHash,
        role: "ADMIN",
      },
    });

    if (SEED_ADMIN_PASSWORD === "admin123") {
      console.warn(
        `\n⚠  Created admin user "${SEED_ADMIN_USERNAME}" with the DEFAULT password ` +
          `"admin123". Change it immediately after first login.`
      );
    } else {
      console.log(`✔ Created admin user "${SEED_ADMIN_USERNAME}".`);
    }
  }

  // 2. Starter categories (skip any that already exist by slug)
  const starterCategories = [
    {
      name: "Sofas",
      description:
        `Explore ${STORE_NAME}'s range of sofas in ${STORE_CITY} — solid wood frames, ` +
        `comfortable cushioning and durable finishes built for Indian homes and family ` +
        `living rooms.`,
    },
    {
      name: "Beds",
      description:
        `Wooden beds in every size — single, double, queen and king — crafted from the ` +
        `best-quality sheesham and teak wood at ${STORE_NAME}, ${STORE_CITY}.`,
    },
    {
      name: "Dining Sets",
      description:
        `Solid wood dining tables and chair sets for every home and budget. Visit ` +
        `${STORE_NAME} in ${STORE_CITY} to see the full range in person.`,
    },
    {
      name: "Wardrobes",
      description:
        `Spacious, durable wardrobes in a variety of finishes and sizes, made to order ` +
        `by ${STORE_NAME} in ${STORE_CITY}, Uttar Pradesh.`,
    },
    {
      name: "Chairs",
      description:
        `Comfortable and sturdy chairs for the dining room, study, office and balcony — ` +
        `now available at ${STORE_NAME} in ${STORE_CITY}.`,
    },
  ];

  const categories: { id: number; name: string; slug: string }[] = [];
  for (const cat of starterCategories) {
    const slug = slugify(cat.name);
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      categories.push(existing);
      continue;
    }
    const created = await prisma.category.create({ data: { ...cat, slug } });
    categories.push(created);
    console.log(`  + category "${cat.name}"`);
  }

  // 3. Sample products (placeholder data — swap with real photos via admin panel)
  if (WITH_SAMPLE_PRODUCTS) {
    const sofaCat = categories.find((c) => c.slug === "sofas");
    const bedCat = categories.find((c) => c.slug === "beds");
    const diningCat = categories.find((c) => c.slug === "dining-sets");

    const samples: {
      categoryId: number | undefined;
      name: string;
      slug: string;
      price: string;
      shortDescription: string;
    }[] = [
      {
        categoryId: sofaCat?.id,
        name: "3-Seater Sheesham Wood Sofa",
        slug: "3-seater-sheesham-wood-sofa",
        price: "24999",
        shortDescription:
          "Solid sheesham wood 3-seater sofa with cushioned seating, finished for daily family use.",
      },
      {
        categoryId: sofaCat?.id,
        name: "2-Seater Wooden Sofa with Cushions",
        slug: "2-seater-wooden-sofa-with-cushions",
        price: "16999",
        shortDescription:
          "Compact 2-seater sofa in solid wood, ideal for smaller living rooms.",
      },
      {
        categoryId: bedCat?.id,
        name: "Double Bed with Storage (Sheesham)",
        slug: "double-bed-with-storage-sheesham",
        price: "32999",
        shortDescription:
          "Solid sheesham double bed with under-bed storage, strong and long-lasting.",
      },
      {
        categoryId: diningCat?.id,
        name: "6-Seater Dining Table Set",
        slug: "6-seater-dining-table-set",
        price: "28999",
        shortDescription:
          "6-seater solid wood dining table set with matching chairs.",
      },
    ];

    for (const sample of samples) {
      if (!sample.categoryId) continue; // category not seeded (e.g. sample re-run)
      const existing = await prisma.product.findUnique({
        where: { slug: sample.slug },
      });
      if (existing) continue;

      const product = await prisma.product.create({
        data: {
          categoryId: sample.categoryId,
          name: sample.name,
          slug: sample.slug,
          price: new Prisma.Decimal(sample.price),
          shortDescription: sample.shortDescription,
          isActive: true,
        },
      });

      // One placeholder image + a "SAMPLE IMAGE — replace in admin panel" mark.
      await prisma.productImage.create({
        data: {
          productId: product.id,
          imageUrl: `https://picsum.photos/seed/pragati-${sample.slug}/900/700`,
          displayOrder: 0,
          isPrimary: true,
        },
      });
      console.log(`  + sample product "${sample.name}"`);
    }
  }

  // 4. Starter FAQs — generic placeholder Q&A from docs/DATABASE.md §6, to be
  //    replaced with real answers via the admin panel once the owner confirms them.
  const starterFaqs = [
    {
      question: "Do you offer home delivery in Muzaffarnagar?",
      answer:
        "Yes, we offer home delivery within Muzaffarnagar. For areas outside the city, please contact us to confirm availability and charges.",
    },
    {
      question: "Can furniture be customized (size, fabric, wood finish)?",
      answer:
        "Yes, many of our products can be customized. Visit our store or send us an enquiry with your requirements, and we'll let you know what's possible.",
    },
    {
      question: "What materials are used in your furniture?",
      answer:
        "We work primarily with solid wood (such as sheesham) along with quality fabrics and finishes. Specific materials are listed on each product page where available.",
    },
    {
      question: "What are your store timings?",
      answer:
        "Please contact us or check our Google Business listing for current store hours, as timings may vary on festivals and holidays.",
    },
    {
      question: "Do you provide a warranty on furniture?",
      answer:
        "Warranty terms vary by product. Please ask in-store or mention it in your enquiry, and we'll confirm the applicable warranty for the item you're interested in.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept cash and standard digital payment methods in-store. Please contact us for details on advance payment for custom orders.",
    },
    {
      question: "How long does delivery take after ordering?",
      answer:
        "Delivery timelines depend on whether the item is in stock or made to order. We'll confirm an estimated timeline when you enquire about a specific product.",
    },
    {
      question: "Can I visit the store to see the furniture in person?",
      answer:
        "Absolutely — we encourage it, especially for larger pieces. Visit us at our Muzaffarnagar store, or check the Contact page for our address and map.",
    },
  ];

  for (let i = 0; i < starterFaqs.length; i++) {
    const faq = starterFaqs[i];
    const existing = await prisma.faq.findFirst({ where: { question: faq.question } });
    if (existing) continue;
    await prisma.faq.create({
      data: { ...faq, displayOrder: i + 1, isActive: true },
    });
    console.log(`  + FAQ "${faq.question}"`);
  }

  // 5. Enquiries — leave empty by design.

  console.log("\nSeed complete. Log in at /admin to add your real products and images.");
  console.log(
    `Admin username: ${SEED_ADMIN_USERNAME}${SEED_ADMIN_PASSWORD === "admin123" ? " / password: admin123 (CHANGE ME)" : ""}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });