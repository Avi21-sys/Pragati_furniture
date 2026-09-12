// lib/productHelpers.ts — build Prisma create/update payloads from validated
// product input: turns price numbers into Decimal, derives slugs from names.
// Shared by the admin create + update routes so their behavior can't drift.

import { Prisma } from "@prisma/client";
import { slugify } from "./slugify";
import type { productSchema } from "./validators";
import type { z } from "zod";

export type ProductInput = z.infer<typeof productSchema>;

function toDecimalOrNull(price: number | null | undefined): Prisma.Decimal | null | undefined {
  if (price === undefined) return undefined; // "don't touch this field" for updates
  if (price === null) return null; // "Price on request"
  return new Prisma.Decimal(price);
}

/** Slug is explicit if given, otherwise derived from the name. */
export function resolveSlug(name: string, slug?: string): string {
  return slug ? slug : slugify(name);
}

export function createProductPayload(input: ProductInput) {
  return {
    name: input.name,
    slug: resolveSlug(input.name, input.slug),
    categoryId: input.categoryId,
    price: toDecimalOrNull(input.price),
    shortDescription: input.shortDescription ?? null,
    isActive: input.isActive ?? true,
  };
}

export function updateProductPayload(input: Partial<ProductInput>) {
  const data: {
    name?: string;
    slug?: string;
    categoryId?: number;
    price?: Prisma.Decimal | null;
    shortDescription?: string | null;
    isActive?: boolean;
  } = {};

  if (input.name !== undefined) {
    data.name = input.name;
    // Keep the URL in sync with the name unless an explicit slug was sent.
    if (input.slug === undefined) data.slug = slugify(input.name);
  }
  if (input.slug !== undefined) data.slug = input.slug;
  if (input.categoryId !== undefined) data.categoryId = input.categoryId;
  if (input.price !== undefined) data.price = toDecimalOrNull(input.price);
  if (input.shortDescription !== undefined) data.shortDescription = input.shortDescription ?? null;
  if (input.isActive !== undefined) data.isActive = input.isActive;

  return data;
}