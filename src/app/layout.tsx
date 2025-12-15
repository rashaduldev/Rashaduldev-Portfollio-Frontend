import "./globals.css";
import type { Metadata } from "next";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import { DM_Serif_Display, DM_Sans } from "next/font/google";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Md Rashadul Islam – Portfolio",
  description:
    "Frontend Developer Portfolio showcasing projects, skills, and experience of Md Rashadul Islam.",
  keywords: [
    "Md Rashadul Islam",
    "Frontend Developer",
    "Best Frontend Developer",
    "Bangladesh Frontend Developer",
    "Bangladesh Best Frontend Developer",
    "React Developer",
    "Portfolio",
    "JavaScript",
    "Next.js",
    "Web Developer in Bangladesh",
  ],
  authors: [
    { name: "Md Rashadul Islam", url: "https://rashaduldev01.vercel.app" },
  ],
  creator: "Md Rashadul Islam",
  metadataBase: new URL("https://rashaduldev01.vercel.app"),
  openGraph: {
    title: "Md Rashadul Islam – Frontend Developer Portfolio",
    description:
      "Explore the professional portfolio of Md Rashadul Islam, a passionate frontend developer specialized in React and modern web technologies.",
    url: "https://rashaduldev01.vercel.app",
    siteName: "Md Rashadul Islam Portfolio",
    images: [
      {
        url: "https://res.cloudinary.com/de8yddexc/image/upload/v1747461829/resume/banner.png",
        width: 1200,
        height: 630,
        alt: "Md Rashadul Islam Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Md Rashadul Islam – Frontend Developer Portfolio",
    description:
      "Portfolio of Md Rashadul Islam, featuring web development projects and skills.",
    creator: "@rashaduldev",
    images: [
      "https://res.cloudinary.com/de8yddexc/image/upload/v1747461829/resume/banner.png",
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${dmSerif.variable}
          ${dmSans.variable}
          min-h-screen flex flex-col
          bg-gray-100 text-gray-900
          dark:bg-gray-900 dark:text-gray-100
        `}
      >
        {/* Plausible Analytics */}
        <Script
          defer
          data-domain="rashaduldev01.vercel.app"
          src="https://plausible.io/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
        />

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
