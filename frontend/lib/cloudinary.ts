// lib/cloudinary.ts — Cloudinary SDK config helper for admin image uploads.
// Returns the configured SDK only when all three env vars are present, so the
// admin upload endpoint can return a clear message when setup is missing.

import { v2 as cloudinary } from "cloudinary";

export function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  return cloudinary;
}

/** Upload a base64 data-URI image and return the secure public URL. */
export async function uploadDataUri(dataUri: string): Promise<string> {
  const cloudinary = getCloudinary();
  if (!cloudinary) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    );
  }
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "pragati-furniture/products",
    resource_type: "image",
  });
  return result.secure_url;
}

export { cloudinary };