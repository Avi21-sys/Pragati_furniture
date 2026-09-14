# API Contract — Pragati Furniture Website

> **Revision note:** Endpoints and request/response shapes are unchanged from the original design. What changed: these are now implemented as **Next.js Route Handlers** (`app/api/.../route.ts`) instead of Spring Boot `@RestController` classes, and admin auth uses an **httpOnly cookie** instead of a manually-attached `Authorization` header (simpler and more secure for a same-origin app like this).

## 1. Conventions
- Response envelope (unchanged):
```json
{ "success": true, "data": { }, "message": "Optional message" }
```
- **Admin auth**: JWT stored in an httpOnly cookie (`session`), set automatically by the browser after login. Route Handlers under `/api/admin/**` are protected by **Next.js Proxy** (`proxy.ts` — the renamed Middleware convention) that checks this cookie before the request even reaches the handler.
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

> **FINAL DECISION: `price` is never included in these public responses.** The serializer (`lib/serializers.ts`) must strip the `price` field entirely from both the list and detail responses — not send it as `null`, just omit the key altogether, so there's no ambiguity for the frontend and no chance of it accidentally being rendered. Admin endpoints (Section 3) can still include price, since that's an internal-only view.

### FAQs
**`GET /api/faqs`** → `app/api/faqs/route.ts`
Returns all active FAQs, ordered by `displayOrder`.
```json
// 200 response data
[
  { "id": 1, "question": "Do you offer home delivery?", "answer": "Yes, we deliver..." }
]
```

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
- `GET/POST /api/admin/faqs`, `PUT/DELETE /api/admin/faqs/[id]`, `PATCH /api/admin/faqs/[id]/status` (toggle active/inactive), `PATCH /api/admin/faqs/reorder` (accepts an ordered array of FAQ ids, updates `displayOrder` for each — needed so the admin panel can support drag-to-reorder)

All of these live under `app/api/admin/` and are protected by the same Middleware — no per-route auth code needed, since it's centralized.

## 4. Proxy — auth guard (replaces Spring Security filter)

`frontend/proxy.ts` — the file convention is `proxy` in Next.js 16 (`middleware` was renamed). One deviation from the snippet below (documented in the file): `/api/admin/*` requests get a **401 JSON envelope** instead of a redirect, so the admin panel's `fetch` calls detect an expired session cleanly; pages still redirect to `/admin/login`.

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function proxy(req: NextRequest) {
  const token = req.cookies.get('session')?.value;
  if (!token) return respond(req);
  const session = await verifySession(token);
  if (!session) return respond(req);
  return NextResponse.next();
}

function respond(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ success: false, data: null, message: 'Not authenticated' }, { status: 401 });
  }
  return NextResponse.redirect(new URL('/admin/login', req.url));
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
