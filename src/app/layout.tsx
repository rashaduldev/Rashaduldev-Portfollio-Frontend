import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import Script from "next/script";
import { Analytics } from '@vercel/analytics/next';
import ClientProviders from "@/components/providers/ClientProviders";
import CookieConsent from "@/components/CookieConsent";
import AppQueryProvider from "@/components/providers/ReactQueryProvider";
import PortfolioAssistant from "@/components/PortfolioAssistant";
import NetworkStatus from "@/components/NetworkStatus";
import { DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/seo";

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
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: "Md Rashadul Islam", url: SITE_URL }],
  creator: "Md Rashadul Islam",
  openGraph: { title: SITE_NAME, description: DEFAULT_DESCRIPTION, url: SITE_URL, siteName: SITE_NAME, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: DEFAULT_DESCRIPTION },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning={true} lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body suppressHydrationWarning={true} className={`${dmSerif.variable} ${dmSans.variable}`}>
        <Script
          defer
          data-domain="rashaduldev.vercel.app"
          src="https://plausible.io/js/script.js"
        />

        <ClientProviders>
          <AppQueryProvider>
            <CookieConsent />
            {children}
            <PortfolioAssistant />
            <NetworkStatus />
          </AppQueryProvider>
        </ClientProviders>
        <Analytics />
      </body>
    </html>
  );
}
