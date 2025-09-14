import React, { useState, useEffect, useRef, useContext } from "react";
import { useScroll, useTransform, useSpring } from "framer-motion";
import { LayoutContext } from "./context";

interface Skill {
  key: string;
  value: number;
}

interface ProgressState {
  design: number[];
  tools: number[];
  development: number[];
}
interface SkillTranslations {
  [key: string]: string;
}

interface SkillSectionProps {
  skills: Skill[];
  title: string;
  progress: number[];
  isRTL: boolean;
  renderBar: (value: number) => React.ReactNode;
  translations: SkillTranslations;
}

const designSkills: Skill[] = [
  { key: "photoshop", value: 30 },
  { key: "figma", value: 40 },
  { key: "xd", value: 40 },
  { key: "illustrator", value: 30 },
];

const toolskills: Skill[] = [
  { key: "git", value: 95 },
  { key: "firebase", value: 95 },
  { key: "cloudinary", value: 75 },
  { key: "cpanel", value: 80 },
  { key: "vs", value: 95 },
  { key: "jetBrains", value: 70 },
];

const devSkills: Skill[] = [
  { key: "html", value: 90 },
  { key: "css", value: 90 },
  { key: "tailwind", value: 95 },
  { key: "js", value: 85 },
  { key: "ts", value: 90 },
  { key: "gulp", value: 90 },
  { key: "astro", value: 95 },
  { key: "react", value: 90 },
  { key: "next", value: 90 },
  { key: "node", value: 80 },
  { key: "ex", value: 75 },
  { key: "wp", value: 65 },
];

const SkillSection = ({
  skills,
  title,
  progress,
  renderBar,
  translations,
}: SkillSectionProps) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          } else {
            entry.target.classList.remove("in-view");
          }
        });
      },
      { threshold: 0.2 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="mb-10 transition-all duration-1000 ease-in-out transform translate-y-12 opacity-0 skill-section"
    >
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>
      {skills.map((skill, idx) => (
        <div key={skill.key} className="mb-5">
          <div className="flex justify-between mb-1 text-sm">
            <span>{translations[skill.key] || skill.key}</span>
            <span>{progress[idx]}%</span>
          </div>
          {renderBar(progress[idx])}
        </div>
      ))}
    </div>
  );
};

export default function SkillsSection() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider"
    );
  }

  const { translations, isRTL } = context;

  const [progress, setProgress] = useState<ProgressState>({
    design: [],
    tools: [],
    development: [],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress({
        tools: toolskills.map((s) => s.value),
        design: designSkills.map((s) => s.value),
        development: devSkills.map((s) => s.value),
      });
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const renderBar = (value: number): React.ReactNode => {
    const barColor =
      value === 100
        ? "bg-orange-400 dark:bg-orange-300"
        : "bg-[#3f4144] dark:bg-white";

    return (
      <div className="w-full h-2 overflow-hidden bg-gray-300 rounded dark:bg-gray-700">
        <div
          className={`h-2 transition-all duration-1000 ${barColor}`}
          style={{
            width: `${value}%`,
            float: isRTL ? "right" : "left",
          }}
        />
      </div>
    );
  };

  // Framer Motion scroll + RTL support
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const movementDistance = 1850;

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    isRTL ? ["0px", `${movementDistance}px`] : ["0px", `-${movementDistance}px`]
  );

  const xSpring = useSpring(x, { stiffness: 300, damping: 50 });

  useEffect(() => {
    const unsubscriber = xSpring.onChange((latestX) => {
      const numericX = parseInt(latestX, 10);
      if (
        (!isRTL && numericX <= -movementDistance) ||
        (isRTL && numericX >= movementDistance)
      ) {
        xSpring.set(isRTL ? `${movementDistance}px` : `-${movementDistance}px`);
      }
    });

    return () => {
      unsubscriber();
    };
  }, [xSpring, isRTL]);

  return (
    <section
      ref={sectionRef}
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full py-2 overflow-hidden transition-colors duration-300"
    >
      <h2 className="my-2 text-4xl font-bold md:my-10">
        {translations.skills.about}
      </h2>
      <div className="grid gap-10 md:grid-cols-2">
        {/* Left Column: Tools + Design */}
        <div className="space-y-12">
          <SkillSection
            skills={toolskills}
            title={translations.skills.tools}
            progress={progress.tools}
            isRTL={isRTL}
            renderBar={renderBar}
            translations={translations.skills}
          />
          <SkillSection
            skills={designSkills}
            title={translations.skills.designTitle}
            progress={progress.design}
            isRTL={isRTL}
            renderBar={renderBar}
            translations={translations.skills}
          />
        </div>

        {/* Right Column: Development */}
        <div>
          <SkillSection
            skills={devSkills}
            title={translations.skills.devTitle}
            progress={progress.development}
            isRTL={isRTL}
            renderBar={renderBar}
            translations={translations.skills}
          />
        </div>
      </div>
    </section>
  );
}
