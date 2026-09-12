// app/api/admin/products/route.ts — admin product list + create.
// GET  → all products (active and inactive)
// POST → create a product
// docs/API.md §3.

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, created, fail } from "@/lib/apiResponse";
import { productSchema, parseBody } from "@/lib/validators";
import { createProductPayload } from "@/lib/productHelpers";
import { serializeProduct } from "@/lib/serializers";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true, images: true },
    });
    return ok(products.map(serializeProduct));
  } catch (error) {
    console.error("[admin/products] GET failed", error);
    return fail("Could not load products", 500);
  }
}

export async function POST(req: Request) {
  const { data, error } = await parseBody(req, productSchema);
  if (error) return fail(error, 400);
  const input = data!;

  try {
    if (input.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: input.categoryId },
      });
      if (!category) return fail("Category not found", 400);
    }

    const payload = createProductPayload(input);

    const product = await prisma.product.create({
      data: payload,
      include: { category: true, images: true },
    });

    return created(serializeProduct(product), "Product created");
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return fail("A product with that slug already exists", 409);
    }
    console.error("[admin/products] POST failed", e);
    return fail("Could not create product", 500);
  }
}