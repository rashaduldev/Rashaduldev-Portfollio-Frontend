import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "Rashaduldev – Home",
    template: "%s | Md Rashadul Islam",
  },
  description:
    "Frontend developer portfolio of Md Rashadul Islam — projects, experience, articles, and contact.",
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <div className="min-h-screen section-container mt-20 mb-10 md:mb-20">
        {children}
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
