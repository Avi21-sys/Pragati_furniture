"use client";

// app/admin/products/new/page.tsx — create new product form

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";
import BackLink from "@/components/admin/BackLink";

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    slug: "",
    price: "",
    shortDescription: "",
    isActive: true,
  });

  useEffect(() => {
    apiFetch<Category[]>("/api/admin/categories")
      .then(setCategories)
      .catch(() => setError("Failed to load categories"));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
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

      const product = await apiFetch<{ id: number }>("/api/admin/products", {
        method: "POST",
        body: payload,
      });

      router.push(`/admin/products/${product.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <BackLink href="/admin/products">Back to Products</BackLink>
        <h1 className="text-2xl font-bold text-text-primary">Add Product</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Create a new product. You can add images after creating it.
        </p>
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
            placeholder="e.g. Teak Wood 3-Seater Sofa"
          />
        </div>

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
            <option value="">— Select a category —</option>
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
            placeholder="Auto-generated from name if left blank"
          />
          <p className="mt-1 text-xs text-text-secondary">
            Lowercase letters, numbers, and dashes only. Leave blank to auto-generate.
          </p>
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
            placeholder="Leave blank for 'Price on request'"
          />
        </div>

        <div>
          <label htmlFor="shortDescription" className="block text-sm font-medium text-text-primary">
            Short description
          </label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            rows={3}
            maxLength={2000}
            value={formData.shortDescription}
            onChange={handleChange}
            className="mt-1 block w-full field"
            placeholder="Brief summary shown on product cards"
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
            disabled={loading}
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-text-on-primary transition-colors hover:bg-brand-primary-dark disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create Product"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-brand-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-brand-surface"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
