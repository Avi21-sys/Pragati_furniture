// app/api/admin/faqs/reorder/route.ts — persist FAQ ordering.
// PATCH /api/admin/faqs/reorder with { ids: number[] } in the new top-to-
// bottom order; displayOrder is rewritten 1..N to match array position
// (docs/API.md §3 — lets the admin panel support drag-to-reorder).

import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { faqsReorderSchema, parseBody } from "@/lib/validators";

export async function PATCH(req: Request) {
  const { data, error } = await parseBody(req, faqsReorderSchema);
  if (error) return fail(error, 400);
  const ids = data!.ids;

  try {
    // Verify every id exists before mutating anything, so an out-of-date
    // client list can't silently drop rows.
    const existing = await prisma.faq.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
    if (existing.length !== ids.length) {
      return fail("One or more FAQ ids are invalid", 400);
    }

    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.faq.update({
          where: { id },
          data: { displayOrder: index + 1 },
        })
      )
    );

    return ok({ ids }, "FAQ order updated");
  } catch (e) {
    console.error("[admin/faqs/reorder] PATCH failed", e);
    return fail("Could not reorder FAQs", 500);
  }
}