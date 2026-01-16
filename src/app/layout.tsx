import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import Script from "next/script";
import ClientProviders from "@/components/providers/ClientProviders";
import CookieConsent from "@/components/CookieConsent";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Md Rashadul Islam – Portfolio",
  description: "Frontend Developer Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${dmSerif.variable} ${dmSans.variable}`}>
        <Script
          defer
          data-domain="rashaduldev01.vercel.app"
          src="https://plausible.io/js/script.js"
        />

        <ClientProviders>
          <CookieConsent />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
