// lib/validators.ts — Zod schemas for every request body.
// Validate BEFORE touching Prisma (replace `jakarta.validation` from the old
// Java plan — docs/CONVENTIONS.md §2 "Validation").

import { z } from "zod";

// --- Public ---

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const enquirySchema = z.object({
  productId: z.number().int().optional().nullable(),
  customerName: z.string().min(1).max(100),
  customerPhone: z
    .string()
    .min(7, "Phone number looks too short")
    .max(20)
    .regex(/^[+0-9\s-]+$/, "Phone number contains invalid characters"),
  customerEmail: z
    .union([z.string().email().max(150), z.literal(""), z.literal(null)])
    .optional()
    .nullable(),
  message: z.string().min(1, "Message is required").max(5000),
});

// --- Admin: categories ---

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, or dashes")
    .max(120)
    .optional(),
  description: z.string().max(2000).optional().nullable(),
});

export const updateCategorySchema = createCategorySchema.partial();

// --- Admin: products ---

export const productSchema = z.object({
  name: z.string().min(1).max(150),
  categoryId: z.number().int().positive(),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, or dashes")
    .max(180)
    .optional(),
  price: z
    .union([z.number().positive(), z.literal(null)])
    .optional()
    .nullable(),
  shortDescription: z.string().max(2000).optional().nullable(),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = productSchema.partial();

export const productStatusSchema = z.object({
  isActive: z.boolean(),
});

// --- Admin: enquiries ---

export const enquiryStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED"]),
});

// --- Admin: FAQs ---

export const faqSchema = z.object({
  question: z.string().min(1, "Question is required").max(255),
  answer: z.string().min(1, "Answer is required"),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const updateFaqSchema = faqSchema.partial();

export const faqStatusSchema = z.object({
  isActive: z.boolean(),
});

/** PATCH /api/admin/faqs/reorder — the full ordered list of FAQ ids.
 *  displayOrder is written 1..N following array position (docs/API.md §3). */
export const faqsReorderSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1),
});

// --- Admin: product images ---

const dataUriPattern = /^data:image\/[a-zA-Z0-9.+-]+;base64,/;

export const addImageSchema = z
  .object({
    /** Either an already-hosted URL (e.g. pasted Cloudinary/CDN link)… */
    imageUrl: z.string().url().max(500).optional(),
    /** …or a base64 data-URI the server uploads to Cloudinary. */
    file: z.string().refine((v) => dataUriPattern.test(v), "file must be a base64 image data-URI").optional(),
    displayOrder: z.number().int().min(0).optional(),
    isPrimary: z.boolean().optional(),
  })
  .refine((v) => v.imageUrl !== undefined || v.file !== undefined, {
    message: "Provide either imageUrl or file",
  });

export const deleteImageSchema = z.object({
  imageId: z.number().int().positive(),
});

/** Parse a JSON request body against a schema → { data } on success, { error } on failure. */
export async function parseBody<T>(req: Request, schema: z.ZodType<T>) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return { data: null as null, error: "Request body must be valid JSON" };
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const message = firstIssue
      ? `${firstIssue.path.join(".") || "body"}: ${firstIssue.message}`
      : "Invalid request body";
    return { data: null as null, error: message };
  }
  return { data: result.data as T, error: null as null };
}