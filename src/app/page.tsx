import type { Metadata } from "next";
import Header from '@/components/Header';
import MainLayoutPage from './(mainLayout)/page';
import Footer from '@/components/Footer';
import SystemStatus from '@/components/SystemStatus';
import { createPageMetadata, DEFAULT_DESCRIPTION, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  ...createPageMetadata({ title: SITE_NAME, description: DEFAULT_DESCRIPTION, path: "/" }),
  title: { absolute: SITE_NAME },
};

const MainHomePage = () => {
  return (
   <>
   <Header/>
    <main>
      <MainLayoutPage/>
    </main>
    <Footer/>
    <SystemStatus variant="floating" />
   </>
  );
};

export default MainHomePage;
