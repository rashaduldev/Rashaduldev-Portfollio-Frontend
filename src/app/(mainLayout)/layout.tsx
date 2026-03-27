import Footer from "@/components/Footer";
import Header from "@/components/Header";

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
