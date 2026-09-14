// app/api/products/[slug]/route.ts — GET single product by slug (public, no auth).
// Returns full detail + image gallery. 404 (wrapped) if not found or inactive.
// docs/API.md §2.

import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { serializePublicProduct } from "@/lib/serializers";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, ctx: RouteContext) {
  try {
    const { slug } = await ctx.params;

    const product = await prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        category: true,
        images: true,
      },
    });

    if (!product) {
      return fail("Product not found", 404);
    }

    return ok(serializePublicProduct(product));
  } catch (error) {
    console.error("[products/:slug] GET failed", error);
    return fail("Could not load product", 500);
  }
}