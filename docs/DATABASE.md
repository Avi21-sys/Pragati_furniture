# Database Schema — Pragati Furniture Website

> **Revision note:** Same entities and fields as originally designed — only the tooling changed. Schema is now defined via **Prisma schema** (`prisma/schema.prisma`) instead of raw SQL/JPA entities, and PostgreSQL is accessed through Prisma Client from Next.js API routes.

## 1. Overview
- Database: **PostgreSQL**
- ORM: **Prisma**
- Owned entirely by the Main App (Notification Service has no DB access)
- Categories remain flexible — admin can create/edit/delete freely
- One product can have multiple images (gallery)

## 2. Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Category {
  id          Int       @id @default(autoincrement())
  name        String    @db.VarChar(100)
  slug        String    @unique @db.VarChar(120)
  description String?
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Product {
  id                Int             @id @default(autoincrement())
  categoryId        Int
  category          Category        @relation(fields: [categoryId], references: [id])
  name              String          @db.VarChar(150)
  slug              String          @unique @db.VarChar(180)
  price             Decimal?        @db.Decimal(10, 2)   // nullable — see Open Questions
  shortDescription  String?
  isActive          Boolean         @default(true)
  images            ProductImage[]
  enquiries         Enquiry[]
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  @@index([categoryId])
}

model ProductImage {
  id            Int      @id @default(autoincrement())
  productId     Int
  product       Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  imageUrl      String   @db.VarChar(500)
  displayOrder  Int      @default(0)
  isPrimary     Boolean  @default(false)
}

model Enquiry {
  id             Int       @id @default(autoincrement())
  productId      Int?
  product        Product?  @relation(fields: [productId], references: [id])
  customerName   String    @db.VarChar(100)
  customerPhone  String    @db.VarChar(20)
  customerEmail  String?   @db.VarChar(150)
  message        String
  status         String    @default("NEW") // NEW / CONTACTED / CLOSED
  createdAt      DateTime  @default(now())

  @@index([status])
}

model AdminUser {
  id            Int      @id @default(autoincrement())
  username      String   @unique @db.VarChar(50)
  passwordHash  String   @db.VarChar(255)
  role          String   @default("ADMIN")
  createdAt     DateTime @default(now())
}

model Faq {
  id           Int      @id @default(autoincrement())
  question     String   @db.VarChar(255)
  answer       String
  displayOrder Int      @default(0)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([displayOrder])
}
```

## 3. Notes on Design Choices

- **FINAL DECISION (confirmed with shop owner): price is never displayed publicly, anywhere on the site.** `price` stays in the schema as `Decimal?` — kept so the shop owner has an internal reference number if useful for his own records, and so the field exists without a migration if a future version ever needs it — but no public-facing page or API response should render it. This replaces the earlier "Price on request" ambiguity entirely; there is no per-product toggle needed, it's a blanket rule. See DATABASE.md → API.md → SEO.md for how this flows through response shapes and structured data.
- **`onDelete: Cascade`** on `ProductImage` — deleting a product automatically removes its images, avoiding orphaned rows. Category deletion is **not** cascading — the app logic should block deleting a category that still has products (enforced in the API route, not the DB, so a clear error message can be returned instead of a raw DB constraint error).
- **Indexes** — Prisma auto-indexes `@unique` fields (`slug`, `username`). Explicit `@@index` added on `Product.categoryId` (fast category filtering), `Enquiry.status` (fast admin filtering), and `Faq.displayOrder` (fast ordered retrieval for the FAQ page).
- **Password storage** — `passwordHash` stores a bcrypt hash (via the `bcrypt` npm package), never plain text.
- **Faq model** — simple, flat structure. `displayOrder` lets the shop owner control the order questions appear in (most important questions first), rather than defaulting to creation-date order. `isActive` allows hiding a FAQ without deleting it, consistent with the same pattern used on `Product`.

## 4. Migrations
Prisma Migrate handles schema changes going forward:
```bash
npx prisma migrate dev --name init      # first migration, local dev
npx prisma migrate deploy               # applied in production/CI
```
This replaces the Flyway/Liquibase recommendation from the earlier Java-based plan — Prisma Migrate serves the same purpose (versioned, trackable schema changes) with less setup.

## 5. Open Questions to Confirm with Your Uncle Before Building
1. Final list of categories (not urgent — dynamic, addable anytime via admin panel)
2. ~~Whether price should ever be hidden~~ — **Resolved**: price is never shown publicly (see Section 3)
3. Whether stock/availability matters for v1 — currently excluded; can add `isAvailable Boolean` later via a new migration if needed
4. Initial list of FAQ questions/answers to seed at launch (needs real content from your uncle — common questions customers actually ask him in-store, e.g. delivery, customization, materials, payment)

## 6. Starter FAQ Content (Placeholder — Replace with Real Answers)

Seeded for launch so the FAQ page isn't empty, but these are **generic placeholders written by Claude, not verified with the shop owner.** Treat every answer below as provisional — especially delivery radius/cost, timelines, and payment methods, since those are business specifics only your uncle can confirm accurately. Update via the admin panel once real answers are gathered (see Open Question #4 above).

| Order | Question | Placeholder Answer |
|---|---|---|
| 1 | Do you offer home delivery in Muzaffarnagar? | Yes, we offer home delivery within Muzaffarnagar. For areas outside the city, please contact us to confirm availability and charges. |
| 2 | Can furniture be customized (size, fabric, wood finish)? | Yes, many of our products can be customized. Visit our store or send us an enquiry with your requirements, and we'll let you know what's possible. |
| 3 | What materials are used in your furniture? | We work primarily with solid wood (such as sheesham) along with quality fabrics and finishes. Specific materials are listed on each product page where available. |
| 4 | What are your store timings? | Please contact us or check our Google Business listing for current store hours, as timings may vary on festivals and holidays. |
| 5 | Do you provide a warranty on furniture? | Warranty terms vary by product. Please ask in-store or mention it in your enquiry, and we'll confirm the applicable warranty for the item you're interested in. |
| 6 | What payment methods do you accept? | We accept cash and standard digital payment methods in-store. Please contact us for details on advance payment for custom orders. |
| 7 | How long does delivery take after ordering? | Delivery timelines depend on whether the item is in stock or made to order. We'll confirm an estimated timeline when you enquire about a specific product. |
| 8 | Can I visit the store to see the furniture in person? | Absolutely — we encourage it, especially for larger pieces. Visit us at our Muzaffarnagar store, or check the Contact page for our address and map. |

> Implementation note: seed these via `prisma/seed.ts` alongside the admin user and sample products, with `displayOrder` set to 1-8 matching the table order above.
