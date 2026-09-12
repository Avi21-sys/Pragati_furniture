// app/api/admin/enquiries/[id]/status/route.ts — PATCH update enquiry status.
// docs/API.md §3.

import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { enquiryStatusSchema, parseBody } from "@/lib/validators";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const enquiryId = Number(id);
  if (!Number.isInteger(enquiryId)) return fail("Invalid enquiry id", 400);

  const { data, error } = await parseBody(req, enquiryStatusSchema);
  if (error) return fail(error, 400);

  try {
    const existing = await prisma.enquiry.findUnique({ where: { id: enquiryId } });
    if (!existing) return fail("Enquiry not found", 404);

    await prisma.enquiry.update({
      where: { id: enquiryId },
      data: { status: data!.status },
    });

    return ok(
      { id: enquiryId, status: data!.status },
      `Enquiry marked as ${data!.status}`
    );
  } catch (e) {
    console.error("[admin/enquiries/:id/status] PATCH failed", e);
    return fail("Could not update enquiry status", 500);
  }
}