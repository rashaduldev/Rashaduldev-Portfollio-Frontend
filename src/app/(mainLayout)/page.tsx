import type { Metadata } from "next";
import Banner from "@/components/Banner";
import DeferRender from "@/components/Common/DeferRender";
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

export const metadata: Metadata = {
  title: "Home",
  description:
    "Frontend developer building interactive, responsive web applications with React, Next.js, and modern web technologies.",
  openGraph: {
    title: "Md Rashadul Islam – Portfolio",
    description:
      "Frontend developer building interactive, responsive web applications with React, Next.js, and modern web technologies.",
    type: "website",
  },
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
        <StatsSection />
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
      <ScrollToTopWithProgress />
    </>
  );
};

export default MainLayoutPage;
