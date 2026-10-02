// components/public/WhatsAppButton.tsx — floating WhatsApp click-to-chat button
// shown on every public page with attention pulse animation (ANIMATIONS.md §5.5).

"use client";

import { useEffect, useState } from "react";
import { whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/constants";
import { WhatsAppIcon } from "./Header";

export default function WhatsAppButton() {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Start pulse animation ~3s after mount, run 2 iterations only
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check for reduced motion preference
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      setShouldAnimate(true);
    }, 3000);

    // Stop animation after ~2.5s (2 iterations of 1.25s each)
    const stopTimer = setTimeout(() => {
      setShouldAnimate(false);
    }, 5500);

    return () => {
      clearTimeout(timer);
      clearTimeout(stopTimer);
    };
  }, []);

  return (
    <a
      href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Pragati Furniture on WhatsApp"
      className={`fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-success text-text-on-primary shadow-lg shadow-black/10 transition-transform hover:scale-110 ${
        shouldAnimate ? "whatsapp-pulse" : ""
      }`}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}