// components/public/WhatsAppButton.tsx — floating WhatsApp click-to-chat button
// shown on every public page (Project Scope §3, SEO channel emphasis).

import { whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/constants";
import { WhatsAppIcon } from "./Header";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Pragati Furniture on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-success text-text-on-primary shadow-lg shadow-black/10 transition-transform hover:scale-110"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}