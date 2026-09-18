import Header from '@/components/Header';
import MainLayoutPage from './(mainLayout)/page';
import Footer from '@/components/Footer';
import SystemStatus from '@/components/SystemStatus';

const MainHomePage = () => {
  return (
   <>
   <Header/>
    <MainLayoutPage/>
    <Footer/>
    <SystemStatus variant="floating" />
   </>
  );
};

export default MainHomePage;
