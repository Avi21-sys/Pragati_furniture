"use client";

// app/admin/faqs/page.tsx — admin FAQ list page.
// Shows every FAQ (active + inactive) in displayOrder with basic reorder
// (up/down buttons → PATCH /api/admin/faqs/reorder), visibility toggle, and
// edit/delete. drag-to-reorder can build on these endpoints later.

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/apiClient";
import BackLink from "@/components/admin/BackLink";

type Faq = {
  id: number;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFaqs();
  }, []);

  async function loadFaqs() {
    try {
      setLoading(true);
      const data = await apiFetch<Faq[]>("/api/admin/faqs");
      setFaqs(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  }

  async function moveFaq(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= faqs.length) return;

    // Optimistically reorder locally, then persist the full order.
    const next = [...faqs];
    [next[index], next[target]] = [next[target], next[index]];
    setFaqs(next);

    try {
      await apiFetch("/api/admin/faqs/reorder", {
        method: "PATCH",
        body: { ids: next.map((f) => f.id) },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reorder FAQs");
      loadFaqs(); // restore the server's order on failure
    }
  }

  async function toggleActive(faq: Faq) {
    try {
      await apiFetch(`/api/admin/faqs/${faq.id}/status`, {
        method: "PATCH",
        body: { isActive: !faq.isActive },
      });
      setFaqs((prev) =>
        prev.map((f) => (f.id === faq.id ? { ...f, isActive: !f.isActive } : f))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update FAQ");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this FAQ? This cannot be undone.")) return;
    try {
      await apiFetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete FAQ");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-text-secondary">Loading FAQs…</p>
      </div>
    );
  }

  if (error && faqs.length === 0) {
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
          <h1 className="text-2xl font-bold text-text-primary">FAQs</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {faqs.length} question{faqs.length !== 1 ? "s" : ""} total — use the
            arrows to set the order shown on the public FAQ page.
          </p>
        </div>
        <Link
          href="/admin/faqs/new"
          className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-text-on-primary transition-colors hover:bg-brand-primary-dark"
        >
          Add FAQ
        </Link>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-brand-error/30 bg-brand-error/10 p-3">
          <p className="text-sm text-brand-error">{error}</p>
        </div>
      ) : null}

      {faqs.length === 0 ? (
        <div className="rounded-lg border border-brand-border bg-brand-surface p-8 text-center">
          <p className="text-text-secondary">No FAQs yet.</p>
          <Link
            href="/admin/faqs/new"
            className="mt-4 inline-block text-sm font-medium text-brand-primary hover:underline"
          >
            Write your first FAQ
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-brand-border bg-brand-surface">
          <table className="w-full">
            <thead className="border-b border-brand-border bg-brand-cream-dark">
              <tr>
                <th className="w-24 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Question
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
              {faqs.map((faq, index) => (
                <tr key={faq.id} className="transition-colors hover:bg-brand-cream-dark/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveFaq(index, -1)}
                        disabled={index === 0}
                        aria-label={`Move "${faq.question}" up`}
                        className="rounded border border-brand-border px-1.5 py-0.5 text-text-primary transition-colors hover:bg-brand-surface disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFaq(index, 1)}
                        disabled={index === faqs.length - 1}
                        aria-label={`Move "${faq.question}" down`}
                        className="rounded border border-brand-border px-1.5 py-0.5 text-text-primary transition-colors hover:bg-brand-surface disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </div>
                  </td>
                  <td className="max-w-md px-4 py-3">
                    <p className="line-clamp-1 font-medium text-text-primary">{faq.question}</p>
                    <p className="line-clamp-1 text-xs text-text-secondary">{faq.answer}</p>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleActive(faq)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        faq.isActive
                          ? "bg-brand-success/15 text-brand-success"
                          : "bg-brand-border/40 text-text-secondary"
                      }`}
                    >
                      {faq.isActive ? "Visible" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/faqs/${faq.id}`}
                        className="rounded border border-brand-border px-3 py-1 text-xs font-medium text-text-primary transition-colors hover:bg-brand-surface"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(faq.id)}
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