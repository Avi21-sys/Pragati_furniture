// app/api/admin/logout/route.ts — POST admin logout (public; clears the cookie).
// docs/API.md §3.

import { ok } from "@/lib/apiResponse";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const res = ok({}, "Logged out");
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}