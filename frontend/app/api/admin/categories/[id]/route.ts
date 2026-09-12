// app/api/admin/categories/[id]/route.ts — admin category update + delete.
// PUT    → update a category
// DELETE → remove a category; BLOCKED when the category still has products
//          (enforced in the route, not the DB, so a clear message is returned).
// docs/API.md §3 / docs/DATABASE.md §3.

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { updateCategorySchema, parseBody } from "@/lib/validators";
import { slugify } from "@/lib/slugify";
import { serializeCategory } from "@/lib/serializers";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const categoryId = Number(id);
  if (!Number.isInteger(categoryId)) return fail("Invalid category id", 400);

  const { data, error } = await parseBody(req, updateCategorySchema);
  if (error) return fail(error, 400);
  const input = data!;

  try {
    const existing = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!existing) return fail("Category not found", 404);

    const updateData: { name?: string; slug?: string; description?: string | null } = {};
    if (input.name !== undefined) {
      updateData.name = input.name;
      if (input.slug === undefined) updateData.slug = slugify(input.name);
    }
    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.description !== undefined) updateData.description = input.description ?? null;

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
    });
    return ok(serializeCategory(category), "Category updated");
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return fail("A category with that slug already exists", 409);
    }
    console.error("[admin/categories/:id] PUT failed", e);
    return fail("Could not update category", 500);
  }
}

export async function DELETE(_req: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const categoryId = Number(id);
  if (!Number.isInteger(categoryId)) return fail("Invalid category id", 400);

  try {
    const existing = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!existing) return fail("Category not found", 404);

    const productCount = await prisma.product.count({
      where: { categoryId },
    });
    if (productCount > 0) {
      // Not cascading by design: move (or delete) its products first.
      return fail(
        `Cannot delete "${existing.name}" — it still has ${productCount} product${productCount === 1 ? "" : "s"}. Move or delete them first.`,
        409
      );
    }

    await prisma.category.delete({ where: { id: categoryId } });
    return ok({ id: categoryId }, "Category deleted");
  } catch (e) {
    console.error("[admin/categories/:id] DELETE failed", e);
    return fail("Could not delete category", 500);
  }
}