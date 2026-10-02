// components/public/MotionProvider.tsx
// Lazy-load motion animations to keep the main bundle small (docs/ANIMATIONS.md §4.1).
// Wrap the (public) layout's children with this provider.

"use client";

import { LazyMotion, domAnimation } from "motion/react";

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}