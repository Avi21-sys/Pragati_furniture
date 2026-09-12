// app/api/enquiries/route.ts — POST submit an enquiry (public, no auth).
//  1. Validates via Zod
//  2. Saves to DB via Prisma
//  3. Calls the Notification Service fire-and-forget
// docs/API.md §2.

import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { enquirySchema, parseBody } from "@/lib/validators";
import { notifyEnquiry } from "@/lib/notify";

export async function POST(req: Request) {
  const { data, error } = await parseBody(req, enquirySchema);
  if (error) return fail(error, 400);

  try {
    const { productId, customerName, customerPhone, customerEmail, message } =
      data!;

    // Resolve product name for the email notification (optional product ref).
    const product = productId
      ? await prisma.product.findUnique({ where: { id: productId } })
      : null;

    const enquiry = await prisma.enquiry.create({
      data: {
        productId: productId ?? null,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        message,
        status: "NEW",
      },
    });

    // Fire-and-forget — never await-notify before responding.
    void notifyEnquiry({
      enquiryId: enquiry.id,
      productName: product?.name ?? null,
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
      message,
    });

    return ok(
      { id: enquiry.id, status: enquiry.status },
      "Thanks! We'll get back to you within a day."
    );
  } catch (error) {
    console.error("[enquiries] POST failed", error);
    return fail("Could not save your enquiry. Please try again.", 500);
  }
}