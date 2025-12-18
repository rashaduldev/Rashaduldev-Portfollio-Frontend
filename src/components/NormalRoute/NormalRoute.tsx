import Banner from "../Banner";
import FaqSection from "../FAQ";
import LatestArticles from "../LatestArticles";
import ProjectsSection from "../ProjectsSection";
import ServicesCarousel from "../ServicesCarouse";
import SkillsMarquee from "../SkillsMarquee";
import SkillsSection from "../SkillsSection";
import StatsSection from "../StatsCountSection";
import TestimonialSection from "../TestimonialSection";
import WhyChooseMe from "../WhyChooseMe";
import WorkExperience from "../WorkExperience";
import EducationSection from "../Education";

const NormalRoute = () => {
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
    </>
  );
};

export default NormalRoute;
