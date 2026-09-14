// app/api/admin/faqs/route.ts — admin FAQ list + create.
// GET  → all FAQs (active and inactive), by displayOrder
// POST → create a FAQ
// docs/API.md §3 (protected by proxy.ts).

import { prisma } from "@/lib/prisma";
import { ok, created, fail } from "@/lib/apiResponse";
import { faqSchema, parseBody } from "@/lib/validators";
import { serializeFaq } from "@/lib/serializers";

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
    });
    return ok(faqs.map(serializeFaq));
  } catch (error) {
    console.error("[admin/faqs] GET failed", error);
    return fail("Could not load FAQs", 500);
  }
}

export async function POST(req: Request) {
  const { data, error } = await parseBody(req, faqSchema);
  if (error) return fail(error, 400);
  const input = data!;

  try {
    const displayOrder =
      input.displayOrder ??
      ((await prisma.faq.aggregate({ _max: { displayOrder: true } }))._max
        .displayOrder ?? 0) + 1; // default: append to the end

    const faq = await prisma.faq.create({
      data: {
        question: input.question,
        answer: input.answer,
        displayOrder,
        isActive: input.isActive ?? true,
      },
    });
    return created(serializeFaq(faq), "FAQ created");
  } catch (e) {
    console.error("[admin/faqs] POST failed", e);
    return fail("Could not create FAQ", 500);
  }
}