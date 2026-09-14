// proxy.ts — central admin auth guard (docs/API.md §4).
// Protects /admin/* pages AND /api/admin/* route handlers with one file.
//
// Deviation from the docs' snippet (documented): for /api/admin/* requests we
// return a 401 JSON envelope instead of a redirect, so the admin panel's fetch
// calls can detect an expired/invalid session cleanly instead of following a
// redirect to the HTML login page. Pages still redirect to /admin/login.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";

// Public exceptions under the protected matchers.
const PUBLIC_PATHS = new Set(["/admin/login", "/api/admin/login", "/api/admin/logout"]);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;
  if (!token) return reject(req);

  const session = await verifySession(token);
  if (!session) return reject(req);

  return NextResponse.next();
}

function reject(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json(
      { success: false, data: null, message: "Not authenticated" },
      { status: 401 }
    );
  }
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
