import type { Metadata } from "next";
import Banner from "@/components/Banner";
import DeferRender from "@/components/Common/DeferRender";
import EducationSection from "@/components/Education";
import FaqSection from "@/components/FAQ";
import LatestArticles from "@/components/LatestArticles";
import ProjectsSection from "@/components/ProjectsSection";
import ServicesCarousel from "@/components/ServicesCarouse";
import SkillsMarquee from "@/components/SkillsMarquee";
import SkillsSection from "@/components/SkillsSection";
import TestimonialSection from "@/components/TestimonialSection";
import WhyChooseMe from "@/components/WhyChooseMe";
import WorkExperience from "@/components/WorkExperience";
import Achievements from "@/components/Achievements";
import { createPageMetadata, DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  ...createPageMetadata({ title: SITE_NAME, description: DEFAULT_DESCRIPTION, path: "/" }),
  title: { absolute: SITE_NAME },
};

const MainLayoutPage = () => {
  return (
    <>
      <Banner />
      <div className="section-container">
        <SkillsSection />
        <SkillsMarquee />
        <WorkExperience />
        <ProjectsSection />
        <Achievements />
        <DeferRender minHeight="500px">
          <TestimonialSection />
        </DeferRender>
        <WhyChooseMe />
        <DeferRender minHeight="400px">
          <ServicesCarousel />
        </DeferRender>
        <EducationSection />
        <DeferRender minHeight="400px">
          <LatestArticles />
        </DeferRender>
        <FaqSection />
      </div>
    </>
  );
};

export default MainLayoutPage;
