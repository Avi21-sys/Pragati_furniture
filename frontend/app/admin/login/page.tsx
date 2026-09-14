"use client";

// app/admin/login/page.tsx — admin sign-in form.
// Submits to /api/admin/login (sets the httpOnly session cookie), then
// navigates to the dashboard. Rendered without the admin shell nav.

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/apiClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await apiFetch("/api/admin/login", {
        method: "POST",
        body: { username, password },
      });
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <p className="text-2xl font-semibold text-text-primary">Pragati Furniture</p>
          <p className="mt-1 text-sm text-text-secondary">Admin sign in</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-brand-border bg-brand-surface p-6 shadow-sm"
        >
          {error && (
            <p className="mb-4 rounded-md border border-brand-error/30 bg-brand-error/10 px-3 py-2 text-sm text-brand-error">{error}</p>
          )}

          <label className="mb-4 block">
            <span className="mb-1 block text-sm font-medium text-text-primary">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="field w-full"
            />
          </label>

          <label className="mb-6 block">
            <span className="mb-1 block text-sm font-medium text-text-primary">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="field w-full"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-text-on-primary transition-colors hover:bg-brand-primary-dark disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          <Link href="/" className="underline-offset-2 hover:underline">
            ← Back to public site
          </Link>
        </p>
      </div>
    </div>
  );
}