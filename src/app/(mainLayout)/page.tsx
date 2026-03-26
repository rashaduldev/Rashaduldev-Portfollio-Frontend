import Banner from "@/components/Banner";
import EducationSection from "@/components/Education";
import FaqSection from "@/components/FAQ";
import LatestArticles from "@/components/LatestArticles";
import ProjectsSection from "@/components/ProjectsSection";
import ScrollToTopWithProgress from "@/components/ScrollToTopWithProgress";
import ServicesCarousel from "@/components/ServicesCarouse";
import SkillsMarquee from "@/components/SkillsMarquee";
import SkillsSection from "@/components/SkillsSection";
import StatsSection from "@/components/StatsCountSection";
import TestimonialSection from "@/components/TestimonialSection";
import WhyChooseMe from "@/components/WhyChooseMe";
import WorkExperience from "@/components/WorkExperience";

const MainLayoutPage = () => {
  return (
    <>
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
      <ScrollToTopWithProgress />
    </>
  );
};

export default MainLayoutPage;
