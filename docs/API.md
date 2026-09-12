# API Contract — Pragati Furniture Website

> **Revision note:** Endpoints and request/response shapes are unchanged from the original design. What changed: these are now implemented as **Next.js Route Handlers** (`app/api/.../route.ts`) instead of Spring Boot `@RestController` classes, and admin auth uses an **httpOnly cookie** instead of a manually-attached `Authorization` header (simpler and more secure for a same-origin app like this).

## 1. Conventions
- Response envelope (unchanged):
```json
{ "success": true, "data": { }, "message": "Optional message" }
```
- **Admin auth**: JWT stored in an httpOnly cookie (`session`), set automatically by the browser after login. Route Handlers under `/api/admin/**` are protected by **Next.js Middleware** (`middleware.ts`) that checks this cookie before the request even reaches the handler.
- Base path: `/api`, implemented as files under `frontend/app/api/`

## 2. Public Endpoints (no auth)

### Categories
**`GET /api/categories`** → `app/api/categories/route.ts`
Returns all categories.

### Products
**`GET /api/products`** → `app/api/products/route.ts`
Supports `?category=slug` query param, filtered via Prisma `where` clause.

**`GET /api/products/[slug]`** → `app/api/products/[slug]/route.ts`
Returns full product detail + image gallery. 404 (wrapped) if not found or inactive.

### Enquiries
**`POST /api/enquiries`** → `app/api/enquiries/route.ts`
1. Validates input (name, phone, message required)
2. Saves to DB via Prisma
3. Calls Notification Service (`fetch` to its URL, with `X-Internal-Api-Key` header) — fire-and-forget with error logging; enquiry is already safely saved regardless of notification success

Request/response shapes are unchanged from the original design (see prior version — same JSON fields).

## 3. Admin Endpoints (JWT cookie required)

### Auth
**`POST /api/admin/login`** → `app/api/admin/login/route.ts`
1. Looks up `AdminUser` by username
2. Verifies password with `bcrypt.compare`
3. Signs a JWT (using `jose`) and sets it as an httpOnly cookie in the response
4. No token is returned in the JSON body — the cookie is the auth mechanism, nothing for client JS to handle manually

```json
// Request
{ "username": "admin", "password": "..." }
// Response
{ "success": true, "data": { "username": "admin" }, "message": "Logged in" }
```

**`POST /api/admin/logout`**
Clears the cookie.

### Products, Categories, Enquiries (admin)
Same endpoint list and request/response shapes as originally planned:
- `GET/POST /api/admin/products`, `PUT/DELETE /api/admin/products/[id]`, `PATCH /api/admin/products/[id]/status`
- `POST/DELETE /api/admin/products/[id]/images`, `PATCH .../images/[imageId]/primary`
- `GET/POST /api/admin/categories`, `PUT/DELETE /api/admin/categories/[id]` (delete blocked if products exist)
- `GET /api/admin/enquiries`, `PATCH /api/admin/enquiries/[id]/status`

All of these live under `app/api/admin/` and are protected by the same Middleware — no per-route auth code needed, since it's centralized.

## 4. Middleware (replaces Spring Security filter)

`frontend/middleware.ts`:
```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('session')?.value;
  if (!token) return NextResponse.redirect(new URL('/admin/login', req.url));

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
```
This single file replaces what would have been a Spring Security `SecurityFilterChain` — same job, far less config.

## 5. Internal Endpoint — Notification Service (separate app, not part of Next.js)

**`POST /internal/notify/enquiry`** (on the Notification Service, e.g. `notification-service/src/index.js`)
- Secured via `X-Internal-Api-Key` header check
- Receives enquiry details, sends email via Nodemailer (SMTP) or a transactional email API
- Request shape unchanged from original design

## 6. Deliberately Excluded from v1 (unchanged)
- No search endpoint
- No pagination on `/api/products` (fine under ~30-50 items)
- No customer accounts
