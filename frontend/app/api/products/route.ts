// app/api/products/route.ts — GET active products (public, no auth).
// Supports ?category=slug to filter by category. docs/API.md §2.

import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { serializeProduct } from "@/lib/serializers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");

    const where = categorySlug
      ? {
          isActive: true,
          category: { slug: categorySlug },
        }
      : { isActive: true };

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: true,
      },
    });

    return ok(products.map(serializeProduct));
  } catch (error) {
    console.error("[products] GET failed", error);
    return fail("Could not load products", 500);
  }
}