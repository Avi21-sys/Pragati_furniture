# Architecture — Pragati Furniture Website

> **Revision note:** This project originally planned a Spring Boot backend + separate microservice. After review, the stack was simplified to **Next.js only** for the main application (frontend + backend combined via API routes), keeping just one small standalone service for notifications. Rationale: for a ~30-product catalog site, a separate Java backend added deployment complexity and hosting cost without a corresponding benefit — see chat discussion for full reasoning. JWT, layered structure, and microservice communication are all still implemented, just in a lighter-weight way.

## 1. High-Level Overview

This is a **monorepo** containing two parts:

1. **Main App** — Next.js (frontend pages + `/admin` panel + backend API routes, all in one app)
2. **Notification Service** — small standalone Node/Express microservice (sends email alerts on new enquiries)

The Next.js app's API routes act as the backend — there is no separate Java/Spring server. The Notification Service is the one deliberately separate piece, kept small and stateless, to preserve real microservice-communication learning (independent deploy, network call, service-to-service auth) without the project needing more than one.

```
                        ┌─────────────────────┐
                        │      Customer        │
                        │   (Browser / Phone)  │
                        └──────────┬───────────┘
                                   │ HTTPS
                                   ▼
                 ┌───────────────────────────────────┐
                 │        Next.js App (all-in-one)     │
                 │  ┌───────────────┐ ┌──────────────┐ │
                 │  │ Public Pages   │ │ /admin panel  │ │
                 │  │ (SSG / ISR)    │ │ (CSR, JWT)    │ │
                 │  └───────┬───────┘ └──────┬────────┘ │
                 │          │                 │           │
                 │          ▼                 ▼           │
                 │  ┌─────────────────────────────────┐  │
                 │  │   API Route Handlers (/app/api)  │  │
                 │  │   - products, categories          │  │
                 │  │   - enquiries                     │  │
                 │  │   - auth (login, JWT)             │  │
                 │  └───────────────┬──────────────────┘  │
                 └──────────────────┼─────────────────────┘
                                    │
                     ┌──────────────┼───────────────┐
                     ▼                              ▼
           ┌───────────────────┐         ┌───────────────────┐
           │   PostgreSQL DB     │         │  Notification       │
           │   (via Prisma ORM)  │         │  Service (Express)  │
           └───────────────────┘         │  sends email on new  │
                                          │  enquiry             │
                                          └──────────┬──────────┘
                                                      ▼
                                          ┌───────────────────┐
                                          │  Email Provider     │
                                          │ (SMTP / Resend etc.)│
                                          └───────────────────┘

       ┌───────────────────┐
       │  Cloudinary (CDN)  │◄──── Product images uploaded from
       │  image storage     │      Admin panel, served directly
       └───────────────────┘      to frontend via URL
```

## 2. Monorepo Folder Structure

```
pragati-furniture/
├── frontend/                  # Next.js app — frontend + backend combined
│   ├── app/
│   │   ├── (public)/           # Public pages: home, products, about, contact
│   │   ├── admin/               # Admin panel routes (CSR)
│   │   └── api/                 # Backend logic lives here — Route Handlers
│   │       ├── products/
│   │       ├── categories/
│   │       ├── enquiries/
│   │       └── admin/
│   │           └── login/
│   ├── prisma/
│   │   └── schema.prisma        # Single source of truth for DB schema
│   ├── lib/                     # Shared server logic, DB client, JWT helpers
│   ├── components/
│   └── public/
├── notification-service/       # Standalone small Express app
│   ├── src/
│   │   ├── index.js
│   │   └── emailService.js
│   └── package.json
├── docs/                        # All project documentation
└── .github/workflows/           # CI/CD pipelines
```

## 3. Component Responsibilities

### Main App (Next.js)
- **Public pages** — Home, Category listing, Product detail, About, Contact (SSG/ISR for SEO)
- **Admin panel (`/admin`)** — login, product CRUD, category CRUD, enquiry viewing (client-rendered, not indexed)
- **API route handlers (`/app/api/**`)** — this *is* the backend now: handles product/category CRUD, enquiry submission, admin login + JWT issuing/validation
- **Database access** — via Prisma Client, directly from route handlers (no separate data-access service needed at this scale)

### Notification Service (Express, standalone)
- One endpoint: `POST /internal/notify/enquiry`
- Called by the Main App's enquiry API route after an enquiry is saved
- Sends an email to the shop owner
- Independently deployed — its own small repo folder, own deployment target, own `package.json`
- Stateless — no database of its own needed for v1

## 4. Auth — Two Distinct Mechanisms (don't conflate them)

| Use case | Who authenticates | Mechanism |
|---|---|---|
| Admin logs into `/admin` panel | Human (uncle/staff) via browser | JWT issued by `/api/admin/login`, stored in an **httpOnly cookie** (safer than localStorage — not accessible to JS, mitigates XSS token theft), validated by Next.js Middleware on every `/admin/*` and `/api/admin/*` request |
| Main App calls Notification Service | Service-to-service, no human involved | Shared secret sent as a header (`X-Internal-Api-Key`), validated by the Notification Service |

This is the same two-mechanism design as the original plan — only the implementation library changes (Node's `jose` package instead of Spring Security).

## 5. Data Storage
- **PostgreSQL** — accessed only by the Main App, via **Prisma ORM**. The Notification Service does not touch the database.
- **Cloudinary** — all product images; only the URL is stored in Postgres.

## 6. Tech Versions (baseline)
- Node.js 20 LTS
- Next.js 14+ (App Router, TypeScript)
- Prisma 5+
- PostgreSQL 16
- Express 4.x (Notification Service only)

## 7. Deployment Targets
- **Main App (Next.js)** → Vercel
- **Notification Service** → Render or Railway (small always-on or on-demand instance)
- **Database** → Managed PostgreSQL (Render/Railway/Supabase/Neon)

## 8. Explicit Non-Goals (unchanged)
- No message queue — a direct HTTP call from the Main App to the Notification Service is sufficient at this scale
- No API Gateway — only one internal service exists to call
- No service discovery tooling — Notification Service URL is a plain environment variable
