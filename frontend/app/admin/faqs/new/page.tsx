"use client";

// app/admin/faqs/new/page.tsx — create new FAQ form.
// New FAQs default to visible and are appended to the end of the order
// (that's the route's default when no displayOrder is sent).

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";
import BackLink from "@/components/admin/BackLink";

export default function NewFaqPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    isActive: true,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
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
      await apiFetch("/api/admin/faqs", {
        method: "POST",
        body: {
          question: formData.question,
          answer: formData.answer,
          isActive: formData.isActive,
        },
      });
      router.push("/admin/faqs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create FAQ");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <BackLink href="/admin/faqs">Back to FAQs</BackLink>
        <h1 className="text-2xl font-bold text-text-primary">Add FAQ</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Write the question the way a customer would actually search it
          (see docs/SEO.md §9).
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-brand-error/30 bg-brand-error/10 p-4">
          <p className="text-sm text-brand-error">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-brand-border bg-brand-surface p-6">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-text-primary">
            Question <span className="text-brand-error">*</span>
          </label>
          <input
            type="text"
            id="question"
            name="question"
            required
            maxLength={255}
            value={formData.question}
            onChange={handleChange}
            className="mt-1 block w-full field"
            placeholder="e.g. Do you offer home delivery in Muzaffarnagar?"
          />
        </div>

        <div>
          <label htmlFor="answer" className="block text-sm font-medium text-text-primary">
            Answer <span className="text-brand-error">*</span>
          </label>
          <textarea
            id="answer"
            name="answer"
            rows={5}
            required
            value={formData.answer}
            onChange={handleChange}
            className="mt-1 block w-full field"
            placeholder="A clear, helpful answer — keep it accurate; customers rely on it."
          />
        </div>

        <label className="flex items-center gap-3 text-sm font-medium text-text-primary">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-brand-border accent-brand-primary"
          />
          Visible on the public FAQ page
        </label>

        <div className="flex items-center gap-3 border-t border-brand-border pt-6">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-text-on-primary transition-colors hover:bg-brand-primary-dark disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create FAQ"}
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