"use client";

// app/admin/categories/new/page.tsx — create new category form

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";
import BackLink from "@/components/admin/BackLink";

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || undefined,
        description: formData.description || null,
      };

      await apiFetch("/api/admin/categories", {
        method: "POST",
        body: payload,
      });

      router.push("/admin/categories");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <BackLink href="/admin/categories">Back to Categories</BackLink>
        <h1 className="text-2xl font-bold text-text-primary">Add Category</h1>
        <p className="mt-1 text-sm text-text-secondary">Create a new product category.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-brand-error/30 bg-brand-error/10 p-4">
          <p className="text-sm text-brand-error">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-brand-border bg-brand-surface p-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-primary">
            Category name <span className="text-brand-error">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            maxLength={100}
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full field"
            placeholder="e.g. Sofas"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-text-primary">
            URL slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            maxLength={120}
            pattern="^[a-z0-9-]*$"
            value={formData.slug}
            onChange={handleChange}
            className="mt-1 block w-full field"
            placeholder="Auto-generated from name if left blank"
          />
          <p className="mt-1 text-xs text-text-secondary">
            Lowercase letters, numbers, and dashes only.
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text-primary">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            maxLength={2000}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full field"
            placeholder="Brief description of this category"
          />
        </div>

        <div className="flex items-center gap-3 border-t border-brand-border pt-6">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-text-on-primary transition-colors hover:bg-brand-primary-dark disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create Category"}
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
