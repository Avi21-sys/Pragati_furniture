// lib/serializers.ts — standard shapes for API responses.
// Prisma rows contain Decimals and nesting; these converters keep the JSON
// contract (docs/API.md) stable across public and admin routes.

import type { Product, Category, ProductImage } from "@prisma/client";

type ProductWithRelations = Product & {
  category: Category;
  images: ProductImage[];
};

export type PublicProduct = {
  id: number;
  name: string;
  slug: string;
  price: number | null;
  shortDescription: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  category: { id: number; name: string; slug: string };
  primaryImageUrl: string | null;
  images: { id: number; imageUrl: string; displayOrder: number; isPrimary: boolean }[];
};

export function serializeProduct(product: ProductWithRelations): PublicProduct {
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
    price: product.price === null ? null : Number(product.price),
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
    primaryImageUrl: primary? primary.imageUrl : null,
    images: images.map((img) => ({
      id: img.id,
      imageUrl: img.imageUrl,
      displayOrder: img.displayOrder,
      isPrimary: img.isPrimary,
    })),
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