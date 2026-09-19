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
import JsonLd from "@/components/Seo/JsonLd";
import { createPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({ title: "Home", description: "Frontend developer building interactive, responsive web applications with React, Next.js, TypeScript, and modern web technologies.", path: "/" });

const MainLayoutPage = () => {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Person", name: "Md Rashadul Islam", url: SITE_URL, jobTitle: "Frontend and Full-Stack Developer", sameAs: ["https://github.com/rashaduldev", "https://www.linkedin.com/in/rashaduldev"], knowsAbout: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "UI/UX", "Web Performance"] }} />
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
