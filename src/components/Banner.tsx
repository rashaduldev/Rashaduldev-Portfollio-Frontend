"use client";

import { useContext } from "react";
import { LayoutContext } from "./context";
import { CiLocationArrow1 } from "react-icons/ci";
import {
  IoArrowRedoCircleOutline,
  IoArrowUndoCircleOutline,
} from "react-icons/io5";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaLinkedinIn, FaGithub, FaEnvelope } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import "./banner.css";
import rashadul from "../../public/assets/rashadul-portfollio.png";
import Image from "next/image";
import { SiCodewars } from "react-icons/si";
import CelebrationButton from "./Common/CelebrationButton";

export default function Banner() {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider",
    );
  }

  const { translations, isRTL } = context;

  return (
    <section className="relative w-full min-h-screen pt-5 overflow-hidden">
      {/* Background Image with Zoom Animation — animates transform only (GPU-composited) */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover zoom-bg"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-vector/abstract-horizontal-grid-lines-graph-style-graphic-design_1017-39918.jpg?semt=ais_hybrid&w=740')",
        }}
      />
      {/* Overlay — flat color, no backdrop-filter (full-viewport blur is expensive) */}
      <div className="absolute inset-0 z-10 bg-white/80 dark:bg-black/85" />

      <div
        className={`relative z-10 flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16 px-4 md:px-0 py-16 md:py-24 section-container min-h-screen ${
          isRTL ? "md:flex-row" : ""
        }`}
      >
        {/* Left Content */}
        <div data-aos="fade-down" data-aos-duration="1000"
          className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}
        >
          <span className="mb-2 text-lg font-medium text-gray-700 sm:text-xl md:text-2xl dark:text-gray-300">
            {translations?.main?.subtitle || "Hi there, I'm"}
          </span>
          <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
            <TypeAnimation
              sequence={[
                translations?.main?.title || "Rashadul Islam",
                1000,
                translations?.main?.stack || "Frontend Developer",
                1000,
              ]}
              wrapper="span"
              speed={30}
              repeat={Infinity}
            />
          </h1>
          <p className="mb-6 text-base leading-relaxed text-justify text-gray-600 sm:text-lg dark:text-gray-300 max-w-xl">
            {translations?.main?.description ||
              "I build interactive and responsive web applications using modern web technologies. Let's turn your ideas into reality."}
          </p>
          <p className="mb-5 font-semibold text-gray-900 dark:text-gray-200">
            {translations?.main?.quata}
          </p>

          {/* Social Icons */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {[
              { href: "https://linkedin.com/in/rashaduldev", label: "Visit my LinkedIn profile", icon: <FaLinkedinIn size={16} />, color: "bg-blue-600 dark:bg-blue-500", iconColor: "text-blue-600" },
              { href: "https://github.com/rashaduldev", label: "Visit my GitHub profile", icon: <FaGithub size={16} />, color: "bg-gray-900", iconColor: "text-gray-900 dark:text-white" },
              { href: "mailto:rashadul.dev@gmail.com", label: "Send me an email", icon: <FaEnvelope size={16} />, color: "bg-green-500", iconColor: "text-green-500" },
              { href: "https://www.codewars.com/users/rashaduldev", label: "Visit my Codewars profile", icon: <SiCodewars size={16} />, color: "bg-red-500", iconColor: "text-red-500" },
            ].map(({ href, label, icon, color, iconColor }) => (
              <CelebrationButton
                key={href}
                className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700"
                hoverBackgroundClassName={color}
              >
                <Link
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className={`flex h-full w-full items-center justify-center transition-colors group-hover:text-white ${iconColor}`}
                >
                  {icon}
                </Link>
              </CelebrationButton>
            ))}
          </div>

          {/* Buttons */}
          <div
            className={`flex flex-wrap gap-4 items-center ${
              isRTL ? "justify-start" : ""
            }`}
          >
            <Button variant="outline" asChild>
              <Link href="/contact" className="flex items-center gap-2">
                {translations?.main?.leftbutton || "Let's go"}
                <CiLocationArrow1 size={20} />
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <a
                href="/assets/Resume of Md Rashadul Islam.pdf"
                download="Resume of Md Rashadul Islam.pdf"
                className="flex items-center gap-2"
                aria-label="Download resume as PDF"
              >
                {translations?.main?.resume || "Download Resume"}
                {isRTL ? (
                  <IoArrowRedoCircleOutline size={20} />
                ) : (
                  <IoArrowUndoCircleOutline size={20} />
                )}
              </a>
            </Button>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center" data-aos="fade-up" data-aos-duration="1000">
          <div className="relative w-full sm:w-80 lg:w-96 h-auto">
            {/* Image */}
            <Image
              src={rashadul}
              alt="Md Rashadul Islam profile photo"
              width={520}
              height={520}
              priority
              fetchPriority="high"
              className="rounded-full"
            />
          </div>
        </div>

        {/* <DotLottieReact
      src="https://lottie.host/dd41f228-5379-497a-961e-051787531156/xOoltcD2od.lottie"
      loop
      className="h-[400px] w-[800px]"
      autoplay
    /> */}
      </div>
    </section>
  );
}
