// app/api/admin/products/[id]/status/route.ts — PATCH active/inactive a product.
// docs/API.md §3.

import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { productStatusSchema, parseBody } from "@/lib/validators";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) return fail("Invalid product id", 400);

  const { data, error } = await parseBody(req, productStatusSchema);
  if (error) return fail(error, 400);

  try {
    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) return fail("Product not found", 404);

    await prisma.product.update({
      where: { id: productId },
      data: { isActive: data!.isActive },
    });

    return ok(
      { id: productId, isActive: data!.isActive },
      data!.isActive ? "Product is now visible on the site" : "Product is now hidden"
    );
  } catch (e) {
    console.error("[admin/products/:id/status] PATCH failed", e);
    return fail("Could not update product status", 500);
  }
}