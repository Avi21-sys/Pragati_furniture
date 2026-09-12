# Coding Conventions — Pragati Furniture Website

> **Revision note:** Section 2 below (backend conventions) is rewritten for Next.js API routes + a small Express notification service, replacing the earlier Spring Boot module structure. Git workflow and frontend conventions are unchanged.

## 1. Git Workflow (unchanged)

### Branching
- `main` — always deployable, protected
- `feature/{short-description}` — e.g. `feature/product-crud`, `feature/enquiry-form`
- Merge via Pull Request even solo — gives CI/CD a natural trigger point

### Commit Messages — Conventional Commits
`type(scope): short description` — `feat`, `fix`, `docs`, `refactor`, `style`, `test`, `chore`
```
feat(product): add product CRUD API routes
fix(auth): correct JWT cookie expiry
docs(api): update enquiry endpoint contract
chore(ci): add notification-service workflow
```

## 2. Backend Conventions (Next.js API Routes + Prisma)

### File Structure (per resource)
```
app/api/products/
├── route.ts              # GET (list), POST (create — admin only, but shared file is fine with a role check)
└── [slug]/
    └── route.ts           # GET single product
```
Admin-only variants live under `app/api/admin/products/` as separate route files — keeping public and admin routes physically separate makes it obvious at a glance which endpoints are protected by Middleware.

### Shared Server Logic (`lib/`)
```
lib/
├── prisma.ts       # Single shared PrismaClient instance (avoid creating a new one per request)
├── auth.ts         # JWT sign/verify helpers, password hashing helpers
└── validators.ts   # Zod schemas for validating request bodies
```

### Naming
- Files/folders: `kebab-case` for routes (Next.js convention), `camelCase` for functions/variables
- Prisma models: `PascalCase` singular (`Product`, `Category`) — already matches DATABASE.md
- REST endpoints: plural nouns (`/api/products`), matches API.md

### Validation
Use **Zod** to validate all incoming request bodies before touching Prisma — this replaces `jakarta.validation` from the Java plan:
```ts
const createProductSchema = z.object({
  name: z.string().min(1),
  categoryId: z.number(),
  price: z.number().nullable(),
  shortDescription: z.string().optional(),
});
```

### Error Handling
- Every route handler wraps logic in try/catch, returning the standard envelope on failure:
```ts
return NextResponse.json({ success: false, data: null, message: 'Category not found' }, { status: 404 });
```
- Avoid duplicating this pattern by hand everywhere — a small `lib/apiResponse.ts` helper (`ok(data)`, `fail(message, status)`) keeps it consistent, similar in spirit to the old `@ControllerAdvice` but simpler since there's no framework-level exception dispatch to configure.

### Database Access
- Always go through the shared `lib/prisma.ts` client, never instantiate `PrismaClient` inside a route file directly (causes connection pool issues in serverless environments like Vercel)

## 3. Notification Service Conventions (Express)

Small enough that it doesn't need a layered structure — keep it flat:
```
notification-service/src/
├── index.js          # Express app setup, route registration
├── emailService.js   # Sending logic (Nodemailer or provider SDK)
└── middleware/
    └── verifyApiKey.js  # Checks X-Internal-Api-Key header
```
- Naming: `camelCase` throughout (plain JS is fine here — TypeScript is optional for a service this small, unlike the main app)
- No database access — stateless by design (see ARCHITECTURE.md)

## 4. Frontend Conventions (unchanged from original plan)

### Folder Structure
```
frontend/app/
├── (public)/
│   ├── page.tsx
│   ├── products/[category]/page.tsx
│   ├── products/[category]/[product]/page.tsx
│   ├── about/page.tsx
│   └── contact/page.tsx
├── admin/
│   ├── login/page.tsx
│   ├── products/page.tsx
│   ├── categories/page.tsx
│   └── enquiries/page.tsx
├── api/                 # backend logic — see Section 2
├── components/
│   ├── public/
│   └── admin/
└── lib/
```

### Naming
- Components: `PascalCase` (`ProductCard.tsx`)
- Hooks/utils: `camelCase` (`useAuth.ts`)
- **TypeScript throughout** — now even more valuable than before, since frontend and backend share the same codebase and can share types directly (e.g. a `Product` type used by both a route handler and the component that renders it)

### API Calls
- Since API routes are same-origin now (no separate backend URL), frontend calls can use relative paths (`fetch('/api/products')`) — simpler than the original cross-origin setup, and no CORS configuration needed at all for the main app
- Still centralize fetch logic in `lib/apiClient.ts` for consistency and easy error handling

### Styling
- Tailwind CSS, with shared design tokens in `tailwind.config.js` (branding colors still pending, per PROJECT.md)

## 5. Environment Variables (unchanged pattern)
- `.env.example` committed, real `.env` gitignored
- `UPPER_SNAKE_CASE` naming (`JWT_SECRET`, `DATABASE_URL`, `INTERNAL_API_KEY`)

## 6. Testing Expectations (v1)
- Notification Service: basic test that the email-sending function is called correctly (mocked, not sending real emails in CI)
- Frontend/API routes: not mandatory for v1 given scope, but welcome for practice — Vitest or Jest for route handler logic, React Testing Library for components
- CI should at minimum run `npm run build` for frontend and `npm test --if-present` for notification-service on every PR
