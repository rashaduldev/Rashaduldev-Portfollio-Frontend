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
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./banner.css";

export default function Banner() {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider"
    );
  }

  const { translations, isRTL } = context;

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };
  const buttonHover = { scale: 1.05 };

  return (
    <section className="relative w-full min-h-screen mt-5 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-fixed bg-center bg-no-repeat bg-cover zoom-bg"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-vector/abstract-horizontal-grid-lines-graph-style-graphic-design_1017-39918.jpg?semt=ais_hybrid&w=740')",
        }}
      />
      <div className="absolute inset-0 z-10 bg-white/60 dark:bg-black/70 backdrop-blur-sm" />

      <motion.div
        className={`relative z-10 flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16 px-4 md:px-0 py-16 md:py-24 max-w-7xl mx-auto min-h-[100vh] ${
          isRTL ? "md:flex-row-reverse text-right" : "text-left"
        }`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Left Content */}
        <motion.div variants={containerVariants} className="flex-1">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-2 text-lg font-medium text-gray-700 sm:text-xl md:text-2xl dark:text-gray-300"
          >
            {translations?.main?.subtitle || "Hi there, I'm"}
          </motion.h3>

          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-white"
          >
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
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 text-base leading-relaxed text-justify text-gray-600 sm:text-lg dark:text-gray-300 max-w-prose md:min-w-2xl"
          >
            {translations?.main?.description ||
              "I build interactive and responsive web applications using modern web technologies. Let's turn your ideas into reality."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-5 font-semibold text-gray-600 dark:text-gray-100"
          >
            {translations?.main?.quata}
          </motion.div>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            {[
              {
                Icon: FaLinkedinIn,
                url: "https://linkedin.com/in/rashaduldev",
              },
              { Icon: FaGithub, url: "https://github.com/rashaduldev" },
              { Icon: FaEnvelope, url: "mailto:rashadul.dev@gmail.com" },
              { Icon: FaFacebookF, url: "https://facebook.com/rashaduldev" },
            ].map(({ Icon, url }, idx) => (
              <motion.a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="flex items-center justify-center transition bg-gray-200 rounded-full text-g-600 w-9 h-9 hover:bg-orange-500 hover:text-white dark:bg-gray-700 dark:text-white dark:hover:bg-orange-500"
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center gap-4"
          >
            <motion.div whileHover={buttonHover}>
              <Button
                className="px-6 py-2.5 text-base font-semibold bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition rounded-lg"
                asChild
              >
                <Link href="/contact" className="flex items-center gap-2">
                  {translations?.main?.leftbutton || "Let's go"}
                  <CiLocationArrow1 size={20} />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={buttonHover}>
              <Button
                className="px-6 py-2.5 text-base font-medium border border-gray-400 dark:border-gray-600 hover:bg-gray-800 dark:hover:bg-gray-800 transition rounded-lg"
                asChild
              >
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
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Lottie Animation */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center flex-1"
        >
          <DotLottieReact
            src="https://lottie.host/dd41f228-5379-497a-961e-051787531156/xOoltcD2od.lottie"
            loop
            className="h-[400px] w-[800px] md:w-[600px]"
            autoplay
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
