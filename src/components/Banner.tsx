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
import {
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
} from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import "./banner.css";
import rashadul from "../../public/assets/rashadul-portfollio.png";
import Image from "next/image";

export default function Banner() {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider"
    );
  }

  const { translations, isRTL } = context;

  return (
    <section className="relative w-full min-h-screen mt-5 overflow-hidden">
      {/* Background Image with Zoom Animation */}
      <div
        className="absolute inset-0 bg-fixed bg-center bg-no-repeat bg-cover zoom-bg"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-vector/abstract-horizontal-grid-lines-graph-style-graphic-design_1017-39918.jpg?semt=ais_hybrid&w=740')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-white/60 dark:bg-black/70 backdrop-blur-sm" />

      <div
        className={`relative z-10 flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16 px-4 md:px-0 py-16 md:py-24 section-container min-h-[100vh] ${
          isRTL ? "md:flex-row" : ""
        }`}
      >
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}
        >
          <h3 className="mb-2 text-lg font-medium text-gray-700 sm:text-xl md:text-2xl dark:text-gray-300">
            {translations?.main?.subtitle || "Hi there, I'm"}
          </h3>
          <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
            <TypeAnimation
              sequence={[
                translations?.main?.title || "Rashadul Islam",
                1000,
                translations?.main?.stack || "Frontend Developer",
                1000,
              ]}
              wrapper="span"
              speed={50}
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
            <Link
              href="https://linkedin.com/in/rashaduldev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center text-blue-600 transition bg-gray-200 rounded-full w-9 h-9 hover:bg-blue-600 hover:text-white dark:bg-gray-700 dark:text-white dark:hover:bg-blue-500"
            >
              <FaLinkedinIn size={16} />
            </Link>
            <Link
              href="https://github.com/rashaduldev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center text-gray-900 transition bg-gray-200 rounded-full w-9 h-9 hover:bg-gray-900 hover:text-white dark:bg-gray-700 dark:text-white"
            >
              <FaGithub size={16} />
            </Link>
            <Link
              href="mailto:rashadul.dev@gmail.com"
              className="flex items-center justify-center text-red-500 transition bg-gray-200 rounded-full w-9 h-9 hover:bg-red-500 hover:text-white dark:bg-gray-700 dark:text-white"
            >
              <FaEnvelope size={16} />
            </Link>
            <Link
              href="https://facebook.com/rashaduldev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center text-blue-500 transition bg-gray-200 rounded-full w-9 h-9 hover:bg-blue-500 hover:text-white dark:bg-gray-700 dark:text-white"
            >
              <FaFacebookF size={16} />
            </Link>
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
              <Link
                href="/assets/Rashadul.pdf"
                download="Resume of Md Rashadul Islam.pdf"
                className="flex items-center gap-2"
              >
                {translations?.main?.resume || "Download Resume"}
                {isRTL ? (
                  <IoArrowRedoCircleOutline size={20} />
                ) : (
                  <IoArrowUndoCircleOutline size={20} />
                )}
              </Link>
            </Button>
          </div>
        </motion.div>

        <div className="flex-1 flex justify-center items-center">
          <div className="relative w-40 sm:w-52 md:w-64 lg:w-80 h-auto">
            {/* Image */}
            <Image
              src={rashadul}
              alt="Md Rashadul Islam profile photo"
              width={420}
              height={420}
              priority
              className="relative w-full h-full object-cover z-20 rounded-full"
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
