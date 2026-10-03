import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SystemStatus from "@/components/SystemStatus";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: "%s | Md Rashadul Islam",
  },
  description: DEFAULT_DESCRIPTION,
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="min-h-screen section-container mt-20 mb-10 md:mb-20">
        {children}
      </main>
      <Footer />
      <SystemStatus variant="floating" />
    </>
  );
};

export default MainLayout;
