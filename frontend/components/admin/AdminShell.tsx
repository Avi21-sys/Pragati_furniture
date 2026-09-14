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
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/enquiries", label: "Enquiries" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    // Re-check on every route change: a client-side navigation from the login
    // page preserves this layout's state, so without re-running the check a
    // stale `null` session would render a blank page on the next route.
    setChecking(true);
    apiFetch<Session>("/api/admin/me")
      .then((data) => {
        if (active) setSession(data);
      })
      .catch(() => {
        if (active && pathname !== "/admin/login") router.replace("/admin/login");
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, [router, pathname]);

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
        <p className="text-sm text-text-secondary">Checking session…</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="border-b border-white/10 bg-brand-primary-dark">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-lg font-semibold text-text-on-primary">Pragati Furniture</p>
            <p className="text-xs text-text-on-primary/60">Admin panel</p>
          </div>
          <nav className="flex items-center gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith(item.href)
                    ? "text-text-on-primary underline decoration-brand-accent decoration-2 underline-offset-[6px]"
                    : "text-text-on-primary/75 hover:text-text-on-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-on-primary/70">{session.username}</span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-text-on-primary/30 px-3 py-1.5 text-sm font-medium text-text-on-primary transition-colors hover:bg-black/10"
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