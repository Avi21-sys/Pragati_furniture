// components/public/RevealOnScroll.tsx
// Scroll-triggered reveal wrapper (docs/ANIMATIONS.md §3). Animates only
// opacity/transform, plays once, and renders fully visible for users who
// prefer reduced motion. Server components wrap content inside this.

"use client";

import { motion, useReducedMotion } from "motion/react";

export default function RevealOnScroll({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}