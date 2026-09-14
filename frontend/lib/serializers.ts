// lib/serializers.ts — standard shapes for API responses.
// Prisma rows contain Decimals and nesting; these converters keep the JSON
// contract (docs/API.md) stable across public and admin routes.

import type { Product, Category, ProductImage, Faq } from "@prisma/client";

type ProductWithRelations = Product & {
  category: Category;
  images: ProductImage[];
};

/** Shared product → JSON conversion. Kept separate from the two public entry
 *  points so the price-omission rule (below) can't drift out of sync. */
function productBase(product: ProductWithRelations) {
  const images = [...product.images].sort((a, b) => a.displayOrder - b.displayOrder);
  const primary =
    images.find((img) => img.isPrimary) ??
    images.find((img) => img.displayOrder === 0) ??
    images[0] ??
    null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    isActive: product.isActive,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    categoryId: product.categoryId,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
    primaryImageUrl: primary ? primary.imageUrl : null,
    images: images.map((img) => ({
      id: img.id,
      imageUrl: img.imageUrl,
      displayOrder: img.displayOrder,
      isPrimary: img.isPrimary,
    })),
  };
}

/** Admin/internal product shape — includes price (docs/API.md §3). */
export type PublicProduct = ReturnType<typeof productBase> & { price: number | null };

export function serializeProduct(product: ProductWithRelations): PublicProduct {
  return {
    ...productBase(product),
    price: product.price === null ? null : Number(product.price),
  };
}

/** Public product shape — the `price` key is omitted entirely, not sent as
 *  `null`, per docs/API.md §2 FINAL DECISION (blanket rule, no per-product
 *  toggle). Admin serialization keeps price; this is the only public path. */
export type PublicApiProduct = ReturnType<typeof productBase>;

export function serializePublicProduct(product: ProductWithRelations): PublicApiProduct {
  return productBase(product);
}

/** FAQ — full shape for admin responses (docs/API.md §3). The public FAQ
 *  endpoint returns only id/question/answer (docs/API.md §2). */
export function serializeFaq(faq: Faq) {
  return {
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    displayOrder: faq.displayOrder,
    isActive: faq.isActive,
    createdAt: faq.createdAt.toISOString(),
    updatedAt: faq.updatedAt.toISOString(),
  };
}

/** Category with its active-product count (for grids / nav badges). */
export function serializeCategory(category: Category, activeProductCount = 0) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    productCount: activeProductCount,
  };
}