// app/api/admin/categories/route.ts — admin category list + create.
// GET  → all categories (with total product counts)
// POST → create a category
// docs/API.md §3.

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, created, fail } from "@/lib/apiResponse";
import { createCategorySchema, parseBody } from "@/lib/validators";
import { slugify } from "@/lib/slugify";
import { serializeCategory } from "@/lib/serializers";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return ok(categories.map((cat) => serializeCategory(cat, cat._count.products)));
  } catch (e) {
    console.error("[admin/categories] GET failed", e);
    return fail("Could not load categories", 500);
  }
}

export async function POST(req: Request) {
  const { data, error } = await parseBody(req, createCategorySchema);
  if (error) return fail(error, 400);
  const input = data!;

  try {
    const category = await prisma.category.create({
      data: {
        name: input.name,
        slug: input.slug ?? slugify(input.name),
        description: input.description ?? null,
      },
    });
    return created(serializeCategory(category), "Category created");
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return fail("A category with that slug already exists", 409);
    }
    console.error("[admin/categories] POST failed", e);
    return fail("Could not create category", 500);
  }
}