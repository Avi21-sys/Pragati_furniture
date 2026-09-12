// components/public/EnquiryForm.tsx — client component. Posts to /api/enquiries
// (docs/API.md §2) and shows a success/error state. Used on product detail and
// contact pages.

"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/apiClient";

type Props = {
  productId?: number;
  productName?: string;
};

type FormState = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  message: string;
};

const emptyForm: FormState = { customerName: "", customerPhone: "", customerEmail: "", message: "" };

export default function EnquiryForm({ productId, productName }: Props) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const update = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      await apiFetch("/api/enquiries", {
        method: "POST",
        body: {
          ...form,
          customerEmail: form.customerEmail || null,
          productId: productId ?? null,
        },
      });
      setStatus("success");
      setForm(emptyForm);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg bg-brand-success/10 p-6 text-center">
        <p className="text-lg font-semibold text-brand-success">Enquiry sent! 🎉</p>
        <p className="mt-1 text-sm text-brand-text-muted">
          Thanks for reaching out{productName ? ` about "${productName}"` : ""}. We'll contact you
          within a day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {productName ? (
        <div className="rounded-md bg-brand-bg px-4 py-3 text-sm text-brand-text-muted">
          Enquiring about: <span className="font-semibold text-brand-text">{productName}</span>
        </div>
      ) : null}

      <div>
        <label htmlFor="customerName" className="mb-1 block text-sm font-medium text-brand-text">
          Your name *
        </label>
        <input
          id="customerName"
          type="text"
          required
          value={form.customerName}
          onChange={update("customerName")}
          placeholder="e.g. Ramesh Kumar"
          className="w-full rounded-md border border-brand-border bg-brand-surface px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />
      </div>

      <div>
        <label htmlFor="customerPhone" className="mb-1 block text-sm font-medium text-brand-text">
          Phone number *
        </label>
        <input
          id="customerPhone"
          type="tel"
          required
          value={form.customerPhone}
          onChange={update("customerPhone")}
          placeholder="e.g. +91 98765 43210"
          className="w-full rounded-md border border-brand-border bg-brand-surface px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />
      </div>

      <div>
        <label htmlFor="customerEmail" className="mb-1 block text-sm font-medium text-brand-text">
          Email <span className="text-brand-text-muted">(optional)</span>
        </label>
        <input
          id="customerEmail"
          type="email"
          value={form.customerEmail}
          onChange={update("customerEmail")}
          placeholder="you@example.com"
          className="w-full rounded-md border border-brand-border bg-brand-surface px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-brand-text">
          Message *
        </label>
        <textarea
          id="message"
          required
          rows={4}
          value={form.message}
          onChange={update("message")}
          placeholder="Tell us what you're looking for — size, wood type, budget…"
          className="w-full resize-y rounded-md border border-brand-border bg-brand-surface px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />
      </div>

      {status === "error" ? (
        <p className="rounded-md bg-brand-error/10 px-3 py-2 text-sm text-brand-error">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-md bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}