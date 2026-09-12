// app/api/admin/enquiries/route.ts — GET all enquiries (admin, JWT cookie required).
// docs/API.md §3.

import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";

export async function GET() {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: {
        product: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return ok(enquiries);
  } catch (e) {
    console.error("[admin/enquiries] GET failed", e);
    return fail("Could not load enquiries", 500);
  }
}