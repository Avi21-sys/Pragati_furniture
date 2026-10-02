// components/public/ProductGallery.tsx — client image gallery: large preview with
// clickable thumbnails and lightbox support (docs/ANIMATIONS.md §5.1).
// Product pages remain statically rendered; only this small component hydrates.

"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import ProductLightbox from "./ProductLightbox";

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleThumbnailClick = useCallback((img: GalleryImage) => {
    setActive(img);
  }, []);

  const openLightbox = useCallback(() => {
    setLightboxOpen(true);
  }, []);

  if (!active) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-brand-border bg-brand-cream-dark text-text-secondary">
        No photo available yet
      </div>
    );
  }

  return (
    <>
      <div>
        {/* Main image with crossfade transition */}
        <div
          className="relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-xl border border-brand-border bg-brand-cream-dark"
          onClick={openLightbox}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && openLightbox()}
          aria-label="Open image in fullscreen"
        >
          {ordered.map((img) => (
            <m.div
              key={img.id}
              initial={shouldReduceMotion ? true : false}
              animate={img.id === active.id ? "visible" : "hidden"}
              variants={{
                visible: { opacity: 1 },
                hidden: { opacity: 0 },
              }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
              style={{ display: img.id === active.id ? "block" : "none" }}
            >
              <Image
                src={img.imageUrl}
                alt={`${productName} — photo ${ordered.indexOf(img) + 1} of ${ordered.length}`}
                fill
                priority={img.id === active.id && ordered.indexOf(img) === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </m.div>
          ))}
        </div>

        {/* Thumbnails */}
        {ordered.length > 1 ? (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {ordered.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => handleThumbnailClick(img)}
                aria-label={`Show photo ${i + 1}`}
                aria-pressed={img.id === active.id}
                className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                  img.id === active.id
                    ? "border-brand-primary"
                    : "border-transparent hover:border-brand-border"
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

      {/* Lightbox — loaded dynamically when first opened */}
      {lightboxOpen && (
        <ProductLightbox
          images={ordered}
          productName={productName}
          initialIndex={ordered.indexOf(active)}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}