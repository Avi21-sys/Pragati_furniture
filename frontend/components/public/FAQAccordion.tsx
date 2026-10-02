// components/public/FAQAccordion.tsx — animated FAQ accordion using CSS grid-rows
// technique (docs/ANIMATIONS.md §5.3). Content stays in DOM when collapsed (crawlable),
// uses pure CSS for animation, and is fully keyboard accessible.

"use client";

import { useState } from "react";

type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

interface FAQAccordionProps {
  faqs: FAQItem[];
}

function FAQAccordionItem({ faq }: { faq: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `faq-panel-${faq.id}`;

  return (
    <div
      data-open={isOpen}
      className="rounded-xl border border-brand-border bg-brand-surface shadow-sm transition-shadow"
      style={{ transitionDuration: 'var(--dur-fast)' }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-text-primary transition-colors hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
      >
        {faq.question}
        <svg
          className="h-5 w-5 shrink-0 text-brand-primary"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transitionDuration: 'var(--dur-base)',
            transitionTimingFunction: 'var(--ease-out)',
            transitionProperty: 'transform',
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        id={panelId}
        className="grid"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transitionDuration: 'var(--dur-base)',
          transitionTimingFunction: 'var(--ease-out)',
          transitionProperty: 'grid-template-rows',
        }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-brand-border px-5 py-4 text-sm leading-6 text-text-secondary sm:text-base sm:leading-7">
            {faq.answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <FAQAccordionItem key={faq.id} faq={faq} />
      ))}
    </div>
  );
}
