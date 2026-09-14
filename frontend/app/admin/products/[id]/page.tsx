"use client";

// app/admin/products/[id]/page.tsx — edit product + manage images

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";
import BackLink from "@/components/admin/BackLink";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type ProductImage = {
  id: number;
  imageUrl: string;
  displayOrder: number;
  isPrimary: boolean;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  category: { id: number; name: string };
  price: number | null;
  shortDescription: string | null;
  isActive: boolean;
  images: ProductImage[];
};

export default function EditProductPage() {
  const params = useParams();
  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    slug: "",
    price: "",
    shortDescription: "",
    isActive: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load product and categories
  useEffect(() => {
    Promise.all([
      apiFetch<Product>(`/api/admin/products/${productId}`),
      apiFetch<Category[]>("/api/admin/categories"),
    ])
      .then(([prod, cats]) => {
        setProduct(prod);
        setCategories(cats);
        setFormData({
          name: prod.name,
          categoryId: String(prod.categoryId),
          slug: prod.slug,
          price: prod.price !== null ? String(prod.price) : "",
          shortDescription: prod.shortDescription || "",
          isActive: prod.isActive,
        });
      })
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [productId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!product) return;

    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        categoryId: parseInt(formData.categoryId, 10),
        slug: formData.slug || undefined,
        price: formData.price ? parseFloat(formData.price) : null,
        shortDescription: formData.shortDescription || null,
        isActive: formData.isActive,
      };

      const updated = await apiFetch<Product>(`/api/admin/products/${productId}`, {
        method: "PATCH",
        body: payload,
      });

      setProduct(updated);
      alert("Product saved!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleUploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !product) return;

    setUploading(true);
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;

        try {
          const newImage = await apiFetch<ProductImage>(`/api/admin/products/${productId}/images`, {
            method: "POST",
            body: { file: base64 },
          });

          setProduct((prev) =>
            prev ? { ...prev, images: [...prev.images, newImage] } : prev
          );
        } catch (err) {
          alert(err instanceof Error ? err.message : "Failed to upload image");
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
      alert("Failed to read file");
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSetPrimary(imageId: number) {
    try {
      await apiFetch(`/api/admin/products/${productId}/images/${imageId}/primary`, {
        method: "POST",
      });
      setProduct((prev) =>
        prev
          ? {
              ...prev,
              images: prev.images.map((img) => ({
                ...img,
                isPrimary: img.id === imageId,
              })),
            }
          : prev
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to set primary image");
    }
  }

  async function handleDeleteImage(imageId: number) {
    if (!confirm("Delete this image?")) return;
    try {
      await apiFetch(`/api/admin/products/${productId}/images`, {
        method: "DELETE",
        body: { imageId },
      });
      setProduct((prev) =>
        prev ? { ...prev, images: prev.images.filter((img) => img.id !== imageId) } : prev
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete image");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-text-secondary">Loading…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-lg border border-brand-error/30 bg-brand-error/10 p-4">
        <p className="text-sm text-brand-error">Product not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <BackLink href="/admin/products">Back to Products</BackLink>
        <h1 className="text-2xl font-bold text-text-primary">Edit Product</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-brand-error/30 bg-brand-error/10 p-4">
          <p className="text-sm text-brand-error">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-brand-border bg-brand-surface p-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-primary">
            Product name <span className="text-brand-error">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            maxLength={150}
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full field"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-text-primary">
              Category <span className="text-brand-error">*</span>
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              value={formData.categoryId}
              onChange={handleChange}
              className="mt-1 block w-full field"
            >
              <option value="">— Select —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-text-primary">
              URL slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              maxLength={180}
              pattern="^[a-z0-9-]*$"
              value={formData.slug}
              onChange={handleChange}
              className="mt-1 block w-full field"
            />
          </div>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-text-primary">
            Price (₹)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full field"
          />
        </div>

        <div>
          <label htmlFor="shortDescription" className="block text-sm font-medium text-text-primary">
            Description
          </label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            rows={3}
            maxLength={2000}
            value={formData.shortDescription}
            onChange={handleChange}
            className="mt-1 block w-full field"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-text-primary">
            Active (visible on public site)
          </label>
        </div>

        <div className="flex items-center gap-3 border-t border-brand-border pt-6">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-text-on-primary transition-colors hover:bg-brand-primary-dark disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Images Section */}
      <div className="mt-8 rounded-xl border border-brand-border bg-brand-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Product Images</h2>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleUploadImage}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg border border-brand-border px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:bg-brand-surface disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Add Image"}
            </button>
          </div>
        </div>

        {product.images.length === 0 ? (
          <p className="text-sm text-text-secondary">No images yet. Add one above.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
            {product.images
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((img) => (
                <div
                  key={img.id}
                  className={`relative rounded-lg border p-1 ${
                    img.isPrimary ? "border-brand-primary" : "border-brand-border"
                  }`}
                >
                  <img
                    src={img.imageUrl}
                    alt=""
                    className="aspect-square w-full rounded object-cover"
                  />
                  {img.isPrimary && (
                    <span className="absolute left-1 top-1 rounded bg-brand-primary px-1.5 py-0.5 text-[10px] font-medium text-text-on-primary">
                      Primary
                    </span>
                  )}
                  <div className="mt-1 flex gap-1">
                    {!img.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(img.id)}
                        className="flex-1 rounded bg-brand-cream-dark px-2 py-1 text-xs font-medium text-text-primary hover:bg-brand-border"
                      >
                        Primary
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="flex-1 rounded bg-brand-error/10 px-2 py-1 text-xs font-medium text-brand-error hover:bg-brand-error/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}