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
```

## 3. Notes on Design Choices

- **`price` is nullable** (`Decimal?`) — supports a "Price on request" pattern if your uncle wants that for some items. Frontend should render "Contact for price" when `null`. (See Open Questions below — confirm this with him.)
- **`onDelete: Cascade`** on `ProductImage` — deleting a product automatically removes its images, avoiding orphaned rows. Category deletion is **not** cascading — the app logic should block deleting a category that still has products (enforced in the API route, not the DB, so a clear error message can be returned instead of a raw DB constraint error).
- **Indexes** — Prisma auto-indexes `@unique` fields (`slug`, `username`). Explicit `@@index` added on `Product.categoryId` (fast category filtering) and `Enquiry.status` (fast admin filtering).
- **Password storage** — `passwordHash` stores a bcrypt hash (via the `bcrypt` npm package), never plain text.

## 4. Migrations
Prisma Migrate handles schema changes going forward:
```bash
npx prisma migrate dev --name init      # first migration, local dev
npx prisma migrate deploy               # applied in production/CI
```
This replaces the Flyway/Liquibase recommendation from the earlier Java-based plan — Prisma Migrate serves the same purpose (versioned, trackable schema changes) with less setup.

## 5. Open Questions to Confirm with Your Uncle Before Building
(Unchanged from original — still needs real answers)
1. Final list of categories (not urgent — dynamic, addable anytime via admin panel)
2. Whether price should ever be hidden ("Price on request") — schema already supports this via nullable `price`, but confirm if it's actually needed
3. Whether stock/availability matters for v1 — currently excluded; can add `isAvailable Boolean` later via a new migration if needed
