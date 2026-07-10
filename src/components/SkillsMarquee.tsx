"use client";
import React, { JSX, useContext } from "react";
import {
  FaGitAlt,
  FaFigma,
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaNodeJs,
} from "react-icons/fa";
import { TbBrandAdobeXd, TbBrandAdobePhotoshop } from "react-icons/tb";

import {
  SiFirebase,
  SiJavascript,
  SiTypescript,
  SiNextdotjs,
  SiExpress,
  SiTailwindcss,
  SiCloudinary,
  SiCpanel,
  SiJetbrains,
  SiPostman,
  SiSwagger,
  SiAxios,
  SiReactquery,
  SiRedux,
  SiMongodb,
  SiAstro,
  SiAudiobookshelf,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import Marquee from "react-fast-marquee";
import { LayoutContext } from "./context";

const SkillsMarquee = () => {
  const context = useContext(LayoutContext);
  if (!context) return null;

  const { translations, isRTL } = context;
  const skills = translations.skills;

  const frontend = [
    { name: skills.react, icon: <FaReact /> },
    { name: skills.next, icon: <SiNextdotjs /> },
    { name: skills.ts, icon: <SiTypescript /> },
    { name: skills.js, icon: <SiJavascript /> },
    { name: skills.tailwind, icon: <SiTailwindcss /> },
    { name: skills.astro, icon: <SiAstro /> },
    { name: skills.html, icon: <FaHtml5 /> },
    { name: skills.css, icon: <FaCss3Alt /> },
  ];

  const stateAndApi = [
    { name: skills.restapi, icon: <SiExpress /> },
    { name: skills.redux, icon: <SiRedux /> },
    { name: skills.tanstackQuery, icon: <SiReactquery /> },
    { name: skills.axios, icon: <SiAxios /> },
    { name: skills.postman, icon: <SiPostman /> },
    { name: skills.swagger, icon: <SiSwagger /> },
  ];

  const tools = [
    { name: skills.git, icon: <FaGitAlt /> },
    { name: skills.vs, icon: <VscVscode /> },
    { name: skills.figma, icon: <FaFigma /> },
    { name: skills.photoshop, icon: <TbBrandAdobePhotoshop /> },
    { name: skills.xd, icon: <TbBrandAdobeXd /> },
    { name: skills.illustrator, icon: <SiAudiobookshelf /> },
  ];

  const backend = [
    { name: skills.node, icon: <FaNodeJs /> },
    { name: skills.mongo, icon: <SiMongodb /> },
    { name: skills.firebase, icon: <SiFirebase /> },
    { name: skills.cloudinary, icon: <SiCloudinary /> },
    { name: skills.jetBrains, icon: <SiJetbrains /> },
    { name: skills.cpanel, icon: <SiCpanel /> },
  ];

  const renderLine = (
    items: { name: string; icon: JSX.Element }[],
    scrollDirection: "left" | "right",
    speed: number = 40,
  ) => (
    <div className="py-1 overflow-hidden">
      <Marquee
        direction={scrollDirection}
        gradient={true}
        gradientColor="var(--marquee-bg)"
        gradientWidth={100}
        speed={speed}
        pauseOnHover={true}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="group flex items-center gap-4 mx-4 px-6 py-3 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border border-gray-200/50 dark:border-zinc-800/50 hover:border-primary/50 hover:bg-white dark:hover:bg-zinc-800                       transition-all duration-300"
          >
            <span className="text-2xl sm:text-3xl text-gray-600 dark:text-zinc-400 group-hover:text-primary group-hover:scale-110 transition-all duration-300">
              {item.icon}
            </span>
            <span className="text-sm sm:text-base font-bold text-gray-700 dark:text-zinc-200 group-hover:text-primary tracking-tight">
              {item.name}
            </span>
          </div>
        ))}
      </Marquee>
    </div>
  );

  const dir = isRTL ? "right" : "left";
  const oppositeDir = isRTL ? "left" : "right";

  return (
    <div data-aos="fade-up" data-aos-duration="1000" className="relative w-full mb-20 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-2">
        {renderLine(frontend, dir, 45)}
        {renderLine(stateAndApi, oppositeDir, 35)}
        {renderLine(tools, dir, 50)}
        {renderLine(backend, oppositeDir, 40)}
      </div>

    </div>
  );
};

export default SkillsMarquee;
