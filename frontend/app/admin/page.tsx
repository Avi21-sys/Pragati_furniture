// app/admin/page.tsx — dashboard landing. Kept as a redirect so the shell nav
// (Products / Categories / Enquiries) always starts somewhere useful.

import { redirect } from "next/navigation";

export default function AdminDashboardPage() {
  redirect("/admin/products");
}