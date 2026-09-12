// app/api/admin/login/route.ts — POST admin login (public; no JWT needed).
// Looks up AdminUser, verifies the bcrypt hash, signs a JWT and sets it as an
// httpOnly `session` cookie. No token returned in the body (docs/API.md §3).
//
// NOTE: this route is whitelisted in middleware.ts.

import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { loginSchema, parseBody } from "@/lib/validators";
import { signSession, comparePassword, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  const { data, error } = await parseBody(req, loginSchema);
  if (error) return fail(error, 400);
  const { username, password } = data!;

  try {
    const admin = await prisma.adminUser.findUnique({ where: { username } });
    if (!admin) return fail("Invalid username or password", 401);

    const valid = await comparePassword(password, admin.passwordHash);
    if (!valid) return fail("Invalid username or password", 401);

    const token = await signSession(admin.username, admin.role);
    const expirySeconds = Number(process.env.JWT_EXPIRY_SECONDS ?? 3600);

    const res = ok({ username: admin.username }, "Logged in");
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: expirySeconds,
    });
    return res;
  } catch (error) {
    console.error("[admin/login] POST failed", error);
    return fail("Login failed", 500);
  }
}