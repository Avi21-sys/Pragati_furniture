"use client";

// app/admin/faqs/[id]/page.tsx — edit FAQ form (question, answer, visibility).

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

export default function EditFaqPage() {
  const params = useParams();
  const faqId = Number(params.id);

  const [faq, setFaq] = useState<Faq | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    isActive: true,
  });

  useEffect(() => {
    apiFetch<Faq>(`/api/admin/faqs/${faqId}`)
      .then((f) => {
        setFaq(f);
        setFormData({
          question: f.question,
          answer: f.answer,
          isActive: f.isActive,
        });
      })
      .catch(() => setError("Failed to load FAQ"))
      .finally(() => setLoading(false));
  }, [faqId]);

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
    if (!faq) return;

    setSaving(true);
    setError(null);

    try {
      await apiFetch(`/api/admin/faqs/${faqId}`, {
        method: "PATCH",
        body: {
          question: formData.question,
          answer: formData.answer,
          isActive: formData.isActive,
        },
      });
      alert("FAQ saved!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save FAQ");
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

  if (!faq) {
    return (
      <div className="rounded-lg border border-brand-error/30 bg-brand-error/10 p-4">
        <p className="text-sm text-brand-error">FAQ not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <BackLink href="/admin/faqs">Back to FAQs</BackLink>
        <h1 className="text-2xl font-bold text-text-primary">Edit FAQ</h1>
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