"use client";

// app/admin/categories/[id]/page.tsx — edit category form

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";
import BackLink from "@/components/admin/BackLink";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

export default function EditCategoryPage() {
  const params = useParams();
  const categoryId = Number(params.id);

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    apiFetch<Category>(`/api/admin/categories/${categoryId}`)
      .then((cat) => {
        setCategory(cat);
        setFormData({
          name: cat.name,
          slug: cat.slug,
          description: cat.description || "",
        });
      })
      .catch(() => setError("Failed to load category"))
      .finally(() => setLoading(false));
  }, [categoryId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category) return;

    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || undefined,
        description: formData.description || null,
      };

      await apiFetch(`/api/admin/categories/${categoryId}`, {
        method: "PATCH",
        body: payload,
      });

      alert("Category saved!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-text-secondary">Loading…</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="rounded-lg border border-brand-error/30 bg-brand-error/10 p-4">
        <p className="text-sm text-brand-error">Category not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <BackLink href="/admin/categories">Back to Categories</BackLink>
        <h1 className="text-2xl font-bold text-text-primary">Edit Category</h1>
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
          />
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
          />
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
    </div>
  );
}