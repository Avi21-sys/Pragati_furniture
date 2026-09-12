// app/api/admin/products/[id]/route.ts — admin update + delete product.
// PUT    → update a product (partial fields accepted)
// DELETE → remove a product (its images cascade by DB constraint)
// docs/API.md §3.

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { updateProductSchema, parseBody } from "@/lib/validators";
import { updateProductPayload } from "@/lib/productHelpers";
import { serializeProduct } from "@/lib/serializers";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) return fail("Invalid product id", 400);

  const { data, error } = await parseBody(req, updateProductSchema);
  if (error) return fail(error, 400);
  const input = data!;

  try {
    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) return fail("Product not found", 404);

    if (input.categoryId !== undefined) {
      const category = await prisma.category.findUnique({
        where: { id: input.categoryId },
      });
      if (!category) return fail("Category not found", 400);
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: updateProductPayload(input),
      include: { category: true, images: true },
    });

    return ok(serializeProduct(product), "Product updated");
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return fail("A product with that slug already exists", 409);
    }
    console.error("[admin/products/:id] PUT failed", e);
    return fail("Could not update product", 500);
  }
}

export async function DELETE(_req: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) return fail("Invalid product id", 400);

  try {
    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) return fail("Product not found", 404);

    await prisma.product.delete({ where: { id: productId } });
    return ok({ id: productId }, "Product deleted");
  } catch (e) {
    console.error("[admin/products/:id] DELETE failed", e);
    return fail("Could not delete product", 500);
  }
}