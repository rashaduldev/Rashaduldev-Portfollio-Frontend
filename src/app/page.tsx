import Banner from '@/components/Banner';
import EducationSection from '@/components/Education';
import FaqSection from '@/components/FAQ';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LatestArticles from '@/components/LatestArticles';
import ProjectsSection from '@/components/ProjectsSection';
import ScrollToTopWithProgress from '@/components/ScrollToTopWithProgress';
import ServicesCarousel from '@/components/ServicesCarouse';
import SkillsMarquee from '@/components/SkillsMarquee';
import SkillsSection from '@/components/SkillsSection';
import StatsSection from '@/components/StatsCountSection';
import TestimonialSection from '@/components/TestimonialSection';
import WhyChooseMe from '@/components/WhyChooseMe';
import WorkExperience from '@/components/WorkExperience';
import React from 'react';

const MainLayout = () => {
  return (
   <>
     <>
    <Header />
    <Banner />
      <div className="section-container">
        <SkillsSection />
        <SkillsMarquee />
        <WorkExperience />
        <ProjectsSection />
        <StatsSection />
        <TestimonialSection />
        <WhyChooseMe />
        {/* issue here */}
        <ServicesCarousel />
        <EducationSection />
        <LatestArticles />
        <FaqSection />
      </div>
      <Footer />
      <ScrollToTopWithProgress />
    </>
   </>
  );
};

export default MainLayout;