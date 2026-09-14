"use client";

// app/admin/products/page.tsx — admin products list page
// Lists all products with edit/delete actions, plus "Add Product" button

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/apiClient";
import BackLink from "@/components/admin/BackLink";

type Product = {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  category: { id: number; name: string };
  price: number | null;
  shortDescription: string | null;
  isActive: boolean;
  images: Array<{ id: number; imageUrl: string; isPrimary: boolean }>;
  createdAt: string;
  updatedAt: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await apiFetch<Product[]>("/api/admin/products");
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      await apiFetch(`/api/admin/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete product");
    }
  }

  async function toggleActive(product: Product) {
    try {
      const updated = await apiFetch<Product>(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        body: { isActive: !product.isActive },
      });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update product");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-text-secondary">Loading products…</p>
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
          <h1 className="text-2xl font-bold text-text-primary">Products</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {products.length} product{products.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-text-on-primary transition-colors hover:bg-brand-primary-dark"
        >
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-brand-border bg-brand-surface p-8 text-center">
          <p className="text-text-secondary">No products yet.</p>
          <Link
            href="/admin/products/new"
            className="mt-4 inline-block text-sm font-medium text-brand-primary hover:underline"
          >
            Create your first product
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-brand-border bg-brand-surface">
          <table className="w-full">
            <thead className="border-b border-brand-border bg-brand-cream-dark">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {products.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-brand-cream-dark/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images[0] ? (
                        <img
                          src={product.images[0].imageUrl}
                          alt=""
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded bg-brand-cream-dark text-xs text-text-secondary">
                          No image
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-text-primary">{product.name}</p>
                        <p className="text-xs text-text-secondary">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-primary">{product.category.name}</td>
                  <td className="px-4 py-3 text-sm text-text-primary">
                    {product.price !== null ? `₹${product.price.toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(product)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                        product.isActive
                          ? "bg-brand-success/10 text-brand-success hover:bg-brand-success/20"
                          : "bg-brand-cream-dark text-text-secondary hover:bg-brand-border"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="rounded border border-brand-border px-3 py-1 text-xs font-medium text-text-primary transition-colors hover:bg-brand-surface"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
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
