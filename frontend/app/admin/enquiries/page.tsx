"use client";

// app/admin/enquiries/page.tsx — admin enquiries list page
// Shows all customer enquiries with status management

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { whatsappLink } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/public/Header";
import BackLink from "@/components/admin/BackLink";

type Enquiry = {
  id: number;
  productId: number | null;
  product: { id: number; name: string; slug: string } | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  message: string;
  status: "NEW" | "CONTACTED" | "CLOSED";
  createdAt: string;
};

const STATUS_OPTIONS = ["NEW", "CONTACTED", "CLOSED"] as const;

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    loadEnquiries();
  }, []);

  async function loadEnquiries() {
    try {
      setLoading(true);
      const data = await apiFetch<Enquiry[]>("/api/admin/enquiries");
      setEnquiries(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(enquiry: Enquiry, newStatus: string) {
    try {
      await apiFetch(`/api/admin/enquiries/${enquiry.id}/status`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiry.id ? { ...e, status: newStatus as typeof e.status } : e))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  const filteredEnquiries = filter === "ALL"
    ? enquiries
    : enquiries.filter((e) => e.status === filter);

  const statusCounts = {
    NEW: enquiries.filter((e) => e.status === "NEW").length,
    CONTACTED: enquiries.filter((e) => e.status === "CONTACTED").length,
    CLOSED: enquiries.filter((e) => e.status === "CLOSED").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-text-secondary">Loading enquiries…</p>
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Enquiries</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Customer messages from the contact form
        </p>
      </div>

      {/* Status filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("ALL")}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            filter === "ALL"
              ? "bg-brand-primary text-text-on-primary"
              : "border border-brand-border text-text-primary hover:bg-brand-surface"
          }`}
        >
          All ({enquiries.length})
        </button>
        <button
          onClick={() => setFilter("NEW")}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            filter === "NEW"
              ? "bg-brand-primary text-text-on-primary"
              : "border border-brand-border text-text-primary hover:bg-brand-surface"
          }`}
        >
          New ({statusCounts.NEW})
        </button>
        <button
          onClick={() => setFilter("CONTACTED")}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            filter === "CONTACTED"
              ? "bg-brand-accent text-brand-primary-dark"
              : "border border-brand-border text-text-primary hover:bg-brand-surface"
          }`}
        >
          Contacted ({statusCounts.CONTACTED})
        </button>
        <button
          onClick={() => setFilter("CLOSED")}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            filter === "CLOSED"
              ? "bg-brand-success text-text-on-primary"
              : "border border-brand-border text-text-primary hover:bg-brand-surface"
          }`}
        >
          Closed ({statusCounts.CLOSED})
        </button>
      </div>

      {filteredEnquiries.length === 0 ? (
        <div className="rounded-lg border border-brand-border bg-brand-surface p-8 text-center">
          <p className="text-text-secondary">
            {filter === "ALL" ? "No enquiries yet." : `No ${filter.toLowerCase()} enquiries.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEnquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className="rounded-lg border border-brand-border bg-brand-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-text-primary">{enquiry.customerName}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        enquiry.status === "NEW"
                          ? "bg-brand-primary/10 text-brand-primary"
                          : enquiry.status === "CONTACTED"
                          ? "bg-brand-accent/20 text-brand-primary-dark"
                          : "bg-brand-success/10 text-brand-success"
                      }`}
                    >
                      {enquiry.status}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary">
                    <a
                      href={`tel:${enquiry.customerPhone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-1.5 hover:text-brand-primary"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {enquiry.customerPhone}
                    </a>
                    {enquiry.customerEmail && (
                      <span className="inline-flex items-center gap-1.5">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="m22 7-10 6L2 7" />
                        </svg>
                        {enquiry.customerEmail}
                      </span>
                    )}
                    {enquiry.product && (
                      <span>
                        re:{" "}
                        <a
                          href={`/products/${enquiry.product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-primary hover:underline"
                        >
                          {enquiry.product.name}
                        </a>
                      </span>
                    )}
                    <span className="text-text-secondary">
                      {new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={whatsappLink(`Hi ${enquiry.customerName}, thank you for contacting Pragati Furniture!`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded border border-brand-success/40 px-3 py-1.5 text-sm font-medium text-brand-success transition-colors hover:bg-brand-success/10"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp
                  </a>
                </div>
              </div>

              <div className="mt-4 rounded bg-brand-cream-dark p-3">
                <p className="whitespace-pre-wrap text-sm text-text-primary">{enquiry.message}</p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-brand-border pt-4">
                <span className="text-sm font-medium text-text-secondary">Update status:</span>
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(enquiry, status)}
                    disabled={enquiry.status === status}
                    className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                      enquiry.status === status
                        ? "bg-brand-primary text-text-on-primary cursor-default"
                        : "border border-brand-border text-text-primary hover:bg-brand-surface"
                    }`}
                  >
                    {status === "NEW" ? "Mark New" : status === "CONTACTED" ? "Mark Contacted" : "Mark Closed"}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}