// components/public/FeaturedStack.tsx — Tinder-style stacked deck for featured
// products/categories (ANIMATIONS.md §6). Homepage only. Draggable on desktop,
// swipeable on touch. Keyboard & button accessible. LazyMotion loads domMax only
// for this component to keep the main bundle lean.

"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import type { PanInfo } from "motion/react";

export type StackItem = {
  id: string;
  render: () => React.ReactNode;
};

interface FeaturedStackProps {
  items: StackItem[];
}

// Load domMax feature only for this component, via async import
const motionMaxFeatures = () => import("./motionMaxFeatures").then((m) => m.default);

function FeaturedStackInner({ items }: FeaturedStackProps) {
  const [active, setActive] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const advance = useCallback((d: 1 | -1) => {
    setActive((p) => (p + d + items.length) % items.length);
  }, [items.length]);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const passed = Math.abs(info.offset.x) > 100 || Math.abs(info.velocity.x) > 500;
      if (passed) {
        advance(info.offset.x < 0 ? 1 : -1);
      }
    },
    [advance]
  );

  const visible = [0, 1, 2].map((o) => (active + o) % items.length);

  return (
    <div className="relative" style={{ height: 420 }}>
      {items.map((item, i) => {
        const pos = visible.indexOf(i);
        const shown = pos !== -1;

        return (
          <m.div
            key={item.id}
            drag={pos === 0 && !shouldReduceMotion ? "x" : false}
            dragSnapToOrigin
            dragElastic={0.2}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={pos === 0 ? handleDragEnd : undefined}
            animate={
              shouldReduceMotion
                ? {
                    x: shown ? pos * 12 : 0,
                    y: shown ? pos * 8 : 0,
                    scale: shown ? 1 : 0.9,
                    opacity: shown ? 1 : 0,
                    zIndex: shown ? 10 - pos : 0,
                  }
                : {
                    x: shown ? pos * 12 : 0,
                    y: shown ? pos * 8 : 0,
                    scale: shown ? 1 - pos * 0.05 : 0.9,
                    opacity: shown ? 1 - pos * 0.15 : 0,
                    zIndex: shown ? 10 - pos : 0,
                  }
            }
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
            style={{ touchAction: "pan-y", cursor: pos === 0 ? "grab" : "default" }}
            aria-hidden={pos !== 0}
          >
            {item.render()}
          </m.div>
        );
      })}

      {/* Navigation buttons */}
      {items.length > 1 && (
        <div className="absolute -bottom-16 left-0 right-0 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => advance(-1)}
            aria-label="Previous featured item"
            className="rounded-lg border border-brand-primary px-4 py-2.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary hover:text-text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            ‹ Prev
          </button>
          <button
            type="button"
            onClick={() => advance(1)}
            aria-label="Next featured item"
            className="rounded-lg border border-brand-primary px-4 py-2.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary hover:text-text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
}

export default function FeaturedStack(props: FeaturedStackProps) {
  return (
    <LazyMotion features={motionMaxFeatures} strict>
      <FeaturedStackInner {...props} />
    </LazyMotion>
  );
}
