// lib/auth.ts — JWT (jose) and password (bcrypt) helpers for admin auth.
// The JWT is stored in an httpOnly cookie named `session` (see middleware.ts
// and docs/API.md §3–4). Uses `jose` instead of jsonwebtoken so it runs in
// Edge middleware and Node route handlers alike.
//
// NOTE on Edge compatibility: middleware.ts imports this module, and the edge
// runtime cannot load the native `bcrypt` module. bcrypt is therefore imported
// DYNAMICALLY inside the password functions so that merely importing auth.ts
// (as middleware does) pulls in only the pure-jose code.

import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "session";

export interface SessionPayload {
  username: string;
  role: string;
}

function secretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

/** Sign a session JWT for an admin user. Expiry seconds from JWT_EXPIRY_SECONDS (default 3600). */
export async function signSession(username: string, role: string): Promise<string> {
  const expirySeconds = Number(process.env.JWT_EXPIRY_SECONDS ?? 3600);
  return new SignJWT({ username, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expirySeconds)
    .sign(secretKey());
}

/** Verify a session JWT; returns the payload or null if invalid/expired. */
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (typeof payload.username !== "string") return null;
    return { username: payload.username, role: String(payload.role ?? "ADMIN") };
  } catch {
    return null;
  }
}

/** Hash a plaintext password with bcrypt (cost factor 12). */
export async function hashPassword(plain: string): Promise<string> {
  const bcrypt = await import("bcrypt");
  return bcrypt.hash(plain, 12);
}

/** Compare a plaintext password against a stored bcrypt hash. */
export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  const bcrypt = await import("bcrypt");
  return bcrypt.compare(plain, hash);
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;