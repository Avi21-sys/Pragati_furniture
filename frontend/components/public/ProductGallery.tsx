// components/public/ProductGallery.tsx — client image gallery: large preview with
// clickable thumbnails. Product pages remain statically rendered; only this small
// component hydrates (docs/SEO.md §8 "keep JS lean on public pages").

"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryImage = { id: number; imageUrl: string; displayOrder: number; isPrimary: boolean };

export default function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const ordered = [...images].sort((a, b) => a.displayOrder - b.displayOrder);
  const [active, setActive] = useState<GalleryImage>(
    ordered.find((img) => img.isPrimary) ?? ordered[0] ?? (null as unknown as GalleryImage)
  );

  if (!active) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-brand-border bg-brand-bg text-text-secondary">
        No photo available yet
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-brand-border bg-brand-bg">
        <Image
          src={active.imageUrl}
          alt={`${productName} — photo ${ordered.indexOf(active) + 1} of ${ordered.length}`}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      {ordered.length > 1 ? (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {ordered.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(img)}
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={img.id === active.id}
              className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                img.id === active.id ? "border-brand-primary" : "border-transparent hover:border-brand-border"
              }`}
            >
              <Image
                src={img.imageUrl}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      <p className="mt-2 text-xs text-text-secondary">
        {ordered.length} photo{ordered.length === 1 ? "" : "s"} · tap a thumbnail to zoom preview
      </p>
    </div>
  );
}