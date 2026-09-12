// components/public/JsonLd.tsx — renders a <script type="application/ld+json"> tag.
// Per docs/SEO.md §5, product pages and home/contact carry structured data.
// Accepts any valid JSON-LD object and serialises it safely.

export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}