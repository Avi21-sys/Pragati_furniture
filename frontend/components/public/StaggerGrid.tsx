// components/public/StaggerGrid.tsx
// Staggered grid reveals (docs/ANIMATIONS.md §3). Wrap the grid in
// <StaggerGroup>, each cell in <StaggerItem> to reveal one after another.
// Only opacity/transform are animated; reduced-motion users get static,
// fully visible content. Optionally lift cards on hover via `hoverLift`.

"use client";

import { motion, useReducedMotion } from "motion/react";

export function StaggerGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? { opacity: 1 } : "hidden"}
      whileInView={shouldReduceMotion ? { opacity: 1 } : "visible"}
      viewport={{ once: true, margin: "-80px" }}
      variants={
        shouldReduceMotion
          ? undefined
          : {
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }
      }
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "h-full",
  hoverLift = false,
}: {
  children: React.ReactNode;
  className?: string;
  hoverLift?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const baseVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={className}
      variants={shouldReduceMotion ? undefined : baseVariants}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={
        shouldReduceMotion || !hoverLift
          ? undefined
          : {
              y: -4,
              boxShadow: "0 8px 20px rgba(42,54,33,0.15)",
              transition: { duration: 0.2 },
            }
      }
    >
      {children}
    </motion.div>
  );
}