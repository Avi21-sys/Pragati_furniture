// app/api/categories/route.ts — GET all categories (public, no auth).
// docs/API.md §2.

import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { serializeCategory } from "@/lib/serializers";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            products: {
              where: { isActive: true },
            },
          },
        },
      },
    });
    if (categories.length === 0) {
      return ok([], "No categories yet — the shop owner will add them soon.");
    }
    return ok(
      categories.map((cat) => serializeCategory(cat, cat._count.products))
    );
  } catch (error) {
    console.error("[categories] GET failed", error);
    return fail("Could not load categories", 500);
  }
}