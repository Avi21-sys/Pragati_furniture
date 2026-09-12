// app/admin/layout.tsx — admin panel shell.
// Server component so we can export metadata (noindex, nofollow) per docs/SEO.md §6.
// The actual nav and session check live in the client AdminShell wrapper.

import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}