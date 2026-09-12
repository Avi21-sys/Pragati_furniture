// app/api/admin/me/route.ts — GET the currently-signed-in admin (JWT cookie).
// The admin panel (CSR) uses this on mount to decide "have a session or show
// login". Adds to the documented admin call-set in docs/API.md §3.

import { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { ok, fail } from "@/lib/apiResponse";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return fail("Not authenticated", 401);

  const session = await verifySession(token);
  if (!session) return fail("Not authenticated", 401);

  return ok({ username: session.username, role: session.role });
}