# Local Development Setup — Pragati Furniture Website

> **Revision note:** Java, Maven, and Spring Boot are no longer part of this project. Setup is now Node.js-only across both apps.

## 1. Prerequisites
- **Node.js 20 LTS** + npm — for both the Next.js main app and the Express notification service
- **PostgreSQL 16** — locally installed, OR a free-tier cloud instance (Neon/Supabase/Render) to skip local install entirely (recommended)
- **Git**
- **Cloudinary** account (free tier) — image uploads
- Email sending method for Notification Service — Gmail SMTP (simplest to start) or a transactional API (Resend/SendGrid)

## 2. Repository Structure Reminder
See `ARCHITECTURE.md` — two independently runnable parts: `frontend/` (Next.js, includes the backend via API routes) and `notification-service/` (small Express app).

## 3. Environment Variables

### `frontend/.env.example`
```
DATABASE_URL=postgresql://postgres:changeme@localhost:5432/pragati_furniture

JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRY_SECONDS=3600

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

NOTIFICATION_SERVICE_URL=http://localhost:4000
INTERNAL_API_KEY=replace-with-a-shared-secret
```

### `notification-service/.env.example`
```
PORT=4000
INTERNAL_API_KEY=replace-with-a-shared-secret   # must match frontend's value
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
NOTIFY_TO_EMAIL=uncle-email@example.com
```

> `INTERNAL_API_KEY` must be identical in both `.env` files — this is how the two apps authenticate each other (see ARCHITECTURE.md, Section 4).

## 4. Running Each App Locally

### Database
```bash
createdb pragati_furniture
```
(Skip this if using a cloud dev instance — just point `DATABASE_URL` at it.)

### Frontend (Main App — Next.js, includes backend) — runs on port 3000
```bash
cd frontend
cp .env.example .env
npm install
npx prisma migrate dev --name init   # creates tables from schema.prisma
npm run dev
```
Visit `http://localhost:3000` for the public site, `http://localhost:3000/admin` for the admin panel.

### Notification Service — runs on port 4000
```bash
cd notification-service
cp .env.example .env
npm install
npm run dev
```

## 5. First-Time Data Setup
1. Prisma creates tables automatically via `migrate dev` — no manual DDL needed
2. Create the first admin user — easiest via a small one-off seed script (`prisma/seed.ts`) that hashes a password with `bcrypt` and inserts an `AdminUser` row:
```bash
npx prisma db seed
```
3. Log into `/admin`, create categories first, then products (products require a valid `categoryId`)

## 6. Migrations Going Forward
```bash
npx prisma migrate dev --name describe-your-change   # local dev
npx prisma migrate deploy                             # production/CI
```
This replaces the earlier Flyway/Hibernate discussion entirely — Prisma Migrate is the single tool for schema versioning in this stack, used from day one (no separate "dev vs prod schema strategy" decision needed, unlike the Hibernate `ddl-auto` situation in the original plan).

## 7. Verifying Everything Works
1. `GET http://localhost:3000/api/categories` → `{"success":true,"data":[]}` (empty until you add some)
2. Home page loads at `http://localhost:3000`
3. `GET http://localhost:4000/health` (add a simple health route) confirms the Notification Service is up before wiring the real integration
