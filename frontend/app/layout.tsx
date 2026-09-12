import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { STORE, SITE_URL } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${STORE.name} | Furniture Store in ${STORE.city}`,
    template: "%s",
  },
  description: `${STORE.name} — quality wooden furniture in ${STORE.city}, ${STORE.region}. Sofas, beds, dining sets, wardrobes and more. Visit our store or enquire online.`,
  applicationName: STORE.name,
  openGraph: {
    type: "website",
    siteName: STORE.name,
    locale: "en_IN",
    countryName: "IN",
  },
  twitter: {
    card: "summary",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}