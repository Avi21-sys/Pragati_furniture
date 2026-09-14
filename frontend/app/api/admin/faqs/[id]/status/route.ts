// app/api/admin/faqs/[id]/status/route.ts — toggle FAQ active/inactive.
// PATCH /api/admin/faqs/:id/status with { isActive } (docs/API.md §3).

import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { faqStatusSchema, parseBody } from "@/lib/validators";
import { serializeFaq } from "@/lib/serializers";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const faqId = Number(id);
  if (!Number.isInteger(faqId)) return fail("Invalid FAQ id", 400);

  const { data, error } = await parseBody(req, faqStatusSchema);
  if (error) return fail(error, 400);

  try {
    const existing = await prisma.faq.findUnique({ where: { id: faqId } });
    if (!existing) return fail("FAQ not found", 404);

    const faq = await prisma.faq.update({
      where: { id: faqId },
      data: { isActive: data!.isActive },
    });
    return ok(serializeFaq(faq), "FAQ status updated");
  } catch (e) {
    console.error("[admin/faqs/:id/status] PATCH failed", e);
    return fail("Could not update FAQ status", 500);
  }
}