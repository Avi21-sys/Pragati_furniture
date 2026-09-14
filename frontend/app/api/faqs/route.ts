// app/api/faqs/route.ts — GET active FAQs (public, no auth).
// Returns ONLY id/question/answer, ordered by displayOrder (docs/API.md §2).
// Structured data on the /faq page must match these — same query, same order.

import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
    });
    return ok(
      faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))
    );
  } catch (error) {
    console.error("[faqs] GET failed", error);
    return fail("Could not load FAQs", 500);
  }
}