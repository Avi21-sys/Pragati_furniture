"use client";

// app/admin/categories/page.tsx — admin categories list page

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/apiClient";
import BackLink from "@/components/admin/BackLink";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  productCount: number;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await apiFetch<Category[]>("/api/admin/categories");
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number, name: string, productCount: number) {
    if (productCount > 0) {
      alert(`Cannot delete "${name}" — it has ${productCount} product(s). Move or delete them first.`);
      return;
    }

    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      await apiFetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete category");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-text-secondary">Loading categories…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-brand-error/30 bg-brand-error/10 p-4">
        <p className="text-sm font-medium text-brand-error">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <BackLink href="/">Back to public site</BackLink>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Categories</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"} total
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-text-on-primary transition-colors hover:bg-brand-primary-dark"
        >
          Add Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-lg border border-brand-border bg-brand-surface p-8 text-center">
          <p className="text-text-secondary">No categories yet.</p>
          <Link
            href="/admin/categories/new"
            className="mt-4 inline-block text-sm font-medium text-brand-primary hover:underline"
          >
            Create your first category
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-brand-border bg-brand-surface">
          <table className="w-full">
            <thead className="border-b border-brand-border bg-brand-cream-dark">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Products
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {categories.map((category) => (
                <tr key={category.id} className="transition-colors hover:bg-brand-cream-dark/40">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-text-primary">{category.name}</p>
                      <p className="text-xs text-text-secondary">/{category.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-primary">
                    {category.productCount} product{category.productCount !== 1 ? "s" : ""}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/categories/${category.id}`}
                        className="rounded border border-brand-border px-3 py-1 text-xs font-medium text-text-primary transition-colors hover:bg-brand-surface"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id, category.name, category.productCount)}
                        className="rounded border border-brand-error/30 px-3 py-1 text-xs font-medium text-brand-error transition-colors hover:bg-brand-error/10"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
