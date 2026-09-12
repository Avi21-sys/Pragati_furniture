// app/api/admin/products/[id]/images/route.ts — add / delete product images.
// POST   → add an image (from a hosted imageUrl, OR a base64 `file` uploaded to
//          Cloudinary server-side). Setting isPrimary demotes the others.
// DELETE → remove an image row given { imageId } (body).
// docs/API.md §3.

import { prisma } from "@/lib/prisma";
import { ok, created, fail } from "@/lib/apiResponse";
import { addImageSchema, deleteImageSchema, parseBody } from "@/lib/validators";
import { uploadDataUri } from "@/lib/cloudinary";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) return fail("Invalid product id", 400);

  const { data, error } = await parseBody(req, addImageSchema);
  if (error) return fail(error, 400);
  const input = data!;

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return fail("Product not found", 404);

    // Upload to Cloudinary if a file was supplied.
    const imageUrl = input.file ? await uploadDataUri(input.file) : input.imageUrl!;

    const runTransaction = async () => {
      if (input.isPrimary) {
        await prisma.productImage.updateMany({
          where: { productId },
          data: { isPrimary: false },
        });
      }
      return prisma.productImage.create({
        data: {
          productId,
          imageUrl,
          displayOrder: input.displayOrder ?? 0,
          isPrimary: input.isPrimary ?? false,
        },
      });
    };

    const image = await prisma.$transaction(runTransaction);
    return created(
      { id: image.id, imageUrl: image.imageUrl, displayOrder: image.displayOrder, isPrimary: image.isPrimary },
      "Image added"
    );
  } catch (e) {
    if (e instanceof Error && e.message.includes("Cloudinary is not configured")) {
      return fail(e.message, 400);
    }
    console.error("[admin/products/:id/images] POST failed", e);
    return fail("Could not add image", 500);
  }
}

export async function DELETE(req: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) return fail("Invalid product id", 400);

  const { data, error } = await parseBody(req, deleteImageSchema);
  if (error) return fail(error, 400);

  try {
    const { imageId } = data!;

    const image = await prisma.productImage.findFirst({
      where: { id: imageId, productId },
    });
    if (!image) return fail("Image not found for this product", 404);

    await prisma.productImage.delete({ where: { id: imageId } });
    return ok({ id: imageId }, "Image removed");
  } catch (e) {
    console.error("[admin/products/:id/images] DELETE failed", e);
    return fail("Could not remove image", 500);
  }
}