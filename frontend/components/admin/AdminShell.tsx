"use client";

// components/admin/AdminShell.tsx — shell for the admin panel (client).
// On mount checks the session via `/api/admin/me`; if missing, redirects to
// the login page. Renders nav + logout. All admin pages render inside this.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";

type Session = { username: string; role: string };

const NAV_ITEMS = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/enquiries", label: "Enquiries" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    apiFetch<Session>("/api/admin/me")
      .then((data) => {
        if (active) setSession(data);
      })
      .catch(() => {
        if (active) router.replace("/admin/login");
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    try {
      await apiFetch("/api/admin/logout", { method: "POST" });
    } catch {
      // Even if the request itself failed, drop the local session state so the
      // user is not stuck behind a stale shell.
    }
    router.replace("/admin/login");
  }

  // The login page renders its own minimal layout, no shell nav.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg">
        <p className="text-sm text-brand-text-muted">Checking session…</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="border-b border-brand-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-lg font-semibold text-brand-text">Pragati Furniture</p>
            <p className="text-xs text-brand-text-muted">Admin panel</p>
          </div>
          <nav className="flex items-center gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith(item.href)
                    ? "text-brand-primary"
                    : "text-brand-text-muted hover:text-brand-text"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-sm text-brand-text-muted">{session.username}</span>
            <button
              onClick={handleLogout}
              className="rounded-md border border-brand-border px-3 py-1.5 text-sm font-medium text-brand-text transition-colors hover:bg-brand-bg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}