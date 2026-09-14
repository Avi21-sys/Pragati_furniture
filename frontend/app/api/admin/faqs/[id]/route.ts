// app/api/admin/faqs/[id]/route.ts — admin get / update / delete FAQ.
// GET    → fetch a single FAQ (for the edit form)
// PUT    → update a FAQ (partial fields accepted)
// PATCH  → update a FAQ (same partial update; used by the admin UI)
// DELETE → remove a FAQ
// docs/API.md §3 (protected by proxy.ts).

import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { updateFaqSchema, parseBody } from "@/lib/validators";
import { serializeFaq } from "@/lib/serializers";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const faqId = Number(id);
  if (!Number.isInteger(faqId)) return fail("Invalid FAQ id", 400);

  try {
    const faq = await prisma.faq.findUnique({ where: { id: faqId } });
    if (!faq) return fail("FAQ not found", 404);
    return ok(serializeFaq(faq));
  } catch (e) {
    console.error("[admin/faqs/:id] GET failed", e);
    return fail("Could not load FAQ", 500);
  }
}

export async function PUT(req: Request, ctx: RouteContext) {
  return updateFaq(req, ctx);
}

export async function PATCH(req: Request, ctx: RouteContext) {
  return updateFaq(req, ctx);
}

async function updateFaq(req: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const faqId = Number(id);
  if (!Number.isInteger(faqId)) return fail("Invalid FAQ id", 400);

  const { data, error } = await parseBody(req, updateFaqSchema);
  if (error) return fail(error, 400);
  const input = data!;

  try {
    const existing = await prisma.faq.findUnique({ where: { id: faqId } });
    if (!existing) return fail("FAQ not found", 404);

    const faq = await prisma.faq.update({
      where: { id: faqId },
      data: {
        ...(input.question !== undefined && { question: input.question }),
        ...(input.answer !== undefined && { answer: input.answer }),
        ...(input.displayOrder !== undefined && { displayOrder: input.displayOrder }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });
    return ok(serializeFaq(faq), "FAQ updated");
  } catch (e) {
    console.error("[admin/faqs/:id] PUT failed", e);
    return fail("Could not update FAQ", 500);
  }
}

export async function DELETE(_req: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const faqId = Number(id);
  if (!Number.isInteger(faqId)) return fail("Invalid FAQ id", 400);

  try {
    const existing = await prisma.faq.findUnique({ where: { id: faqId } });
    if (!existing) return fail("FAQ not found", 404);

    await prisma.faq.delete({ where: { id: faqId } });
    return ok({ id: faqId }, "FAQ deleted");
  } catch (e) {
    console.error("[admin/faqs/:id] DELETE failed", e);
    return fail("Could not delete FAQ", 500);
  }
}