// app/(public)/template.tsx — fades content in on each client navigation.
// Next.js re-mounts template.tsx on navigation (unlike layout.tsx), which is
// the hook needed for a quick, unobtrusive page transition (docs/ANIMATIONS.md
// §3). Fade-only by design — no slide/scale between pages. Admin pages live
// outside this route group, so they stay unanimated.

"use client";

import { motion, useReducedMotion } from "motion/react";

export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
    >
      {children}
    </motion.div>
  );
}