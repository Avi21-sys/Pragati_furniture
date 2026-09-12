// app/api/admin/products/[id]/images/[imageId]/primary/route.ts — PATCH set the
// primary (cover) image for a product. Demotes all other images for the product.
// docs/API.md §3.

import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";

type RouteContext = { params: Promise<{ id: string; imageId: string }> };

export async function PATCH(_req: Request, ctx: RouteContext) {
  const { id, imageId } = await ctx.params;
  const productId = Number(id);
  const imageIdNum = Number(imageId);
  if (!Number.isInteger(productId) || !Number.isInteger(imageIdNum)) {
    return fail("Invalid product or image id", 400);
  }

  try {
    const image = await prisma.productImage.findFirst({
      where: { id: imageIdNum, productId },
    });
    if (!image) return fail("Image not found for this product", 404);

    await prisma.$transaction([
      prisma.productImage.updateMany({
        where: { productId, isPrimary: true },
        data: { isPrimary: false },
      }),
      prisma.productImage.update({
        where: { id: imageIdNum },
        data: { isPrimary: true },
      }),
    ]);

    return ok({ imageId: imageIdNum, isPrimary: true }, "Primary image updated");
  } catch (e) {
    console.error("[admin/products/:id/images/:imageId/primary] PATCH failed", e);
    return fail("Could not update primary image", 500);
  }
}