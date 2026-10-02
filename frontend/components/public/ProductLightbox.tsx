// components/public/ProductLightbox.tsx — native dialog lightbox with crossfade
// (docs/ANIMATIONS.md §5.1). Loaded dynamically when first opened, uses domMax
// for gesture controls, respects reduced motion, and is fully keyboard navigable.

"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import type { PanInfo } from "motion/react";

type GalleryImage = { id: number; imageUrl: string; displayOrder: number; isPrimary: boolean };

interface ProductLightboxProps {
  images: GalleryImage[];
  productName: string;
  initialIndex: number;
  onClose: () => void;
}

export default function ProductLightbox({
  images,
  productName,
  initialIndex,
  onClose,
}: ProductLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const activeImage = images[activeIndex];

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100 || Math.abs(info.velocity.x) > 500) {
      if (info.offset.x < 0) handleNext();
      else handlePrev();
    }
  }, [handlePrev, handleNext]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          handlePrev();
          break;
        case "ArrowRight":
          handleNext();
          break;
      }
    },
    [onClose, handlePrev, handleNext]
  );

  useEffect(() => {
    const dialog = document.getElementById("product-lightbox-dialog") as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
      dialog.addEventListener("close", onClose);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      dialog?.removeEventListener("close", onClose);
    };
  }, [handleKeyDown, onClose]);

  return (
    <dialog
      id="product-lightbox-dialog"
      className="fixed inset-0 z-50 m-0 h-full w-full max-w-none max-h-none overflow-hidden border-0 bg-transparent p-0 backdrop:bg-black/80"
      aria-label={`${productName} — photo ${activeIndex + 1} of ${images.length}`}
      aria-modal="true"
    >
      <div className="flex h-full w-full items-center justify-center p-4">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          aria-label="Close lightbox"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Backdrop fade */}
        <m.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-black/80"
          onClick={onClose}
        />

        {/* Image container */}
        <div className="relative z-10 h-full w-full max-w-5xl max-h-[85vh] overflow-hidden rounded-lg">
          <m.div
            key={activeImage.id}
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-full touch-none"
            drag={shouldReduceMotion ? false : "x"}
            dragSnapToOrigin
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            dragConstraints={{ left: 0, right: 0 }}
            onClick={() => setZoom((prev) => !prev)}
            style={{ touchAction: "pan-y" }}
            aria-label={zoom ? "Zoom out to fit" : "Zoom in on image"}
          >
            <Image
              src={activeImage.imageUrl}
              alt={`${productName} — photo ${activeIndex + 1} of ${images.length}`}
              fill
              className={`object-contain transition-transform duration-300 ${zoom ? "scale-150" : ""}`}
              sizes="(min-width: 1024px) 80vw, 90vw"
            />
          </m.div>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                aria-label="Previous photo"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                aria-label="Next photo"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>

          {/* Zoom hint */}
          <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
            {zoom ? "Click to zoom out" : "Click to zoom in"}
          </div>
        </div>
      </div>
    </dialog>
  );
}