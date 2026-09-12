// app/(public)/layout.tsx — public site shell: header + footer + WhatsApp button.
// Route group, so it adds no URL segment. Categories are fetched here (build time
// for static pages / ISR) and passed to the header + footer navigation.

import { prisma } from "@/lib/prisma";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { name: true, slug: true },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
      <WhatsAppButton />
    </div>
  );
}