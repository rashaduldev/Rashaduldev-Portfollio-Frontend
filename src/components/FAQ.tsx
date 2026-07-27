"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { LayoutContext } from "@/components/context";
import { FaChevronDown } from "react-icons/fa";
import { FAQ } from "@/types/translations";
import { motion, Variants } from "framer-motion";

const faqItemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function FaqSection() {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider",
    );
  }

  const { translations, isRTL } = context;
  const faqs = translations?.faq;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full py-12" dir={isRTL ? "rtl" : "ltr"}>
      <h2 className={`text-center mb-10 ${isRTL ? "text-right" : "text-left"}`}>
        {faqs?.faqTitle || "Frequently Asked Questions"}
      </h2>
      <p className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
        {faqs?.faqDescription ||
          "We’ve compiled answers to the most common queries."}
      </p>

      <motion.div
        className="space-y-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.15 }}
      >
        {faqs?.items?.length ? (
          faqs.items.map((faq, index) => (
            <AnimatedFAQItem
              key={index}
              faq={faq}
              isOpen={activeIndex === index}
              onClick={() => toggle(index)}
              isRTL={isRTL}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">
            No FAQs available at the moment.
          </p>
        )}
      </motion.div>
    </section>
  );
}

type FAQItemProps = {
  faq: FAQ;
  isOpen: boolean;
  onClick: () => void;
  isRTL: boolean;
};

function AnimatedFAQItem({ faq, isOpen, onClick, isRTL }: FAQItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  return (
    <motion.div
      variants={faqItemVariants}
      className={`border border-gray-300 dark:border-gray-700 rounded overflow-hidden ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <button
        onClick={onClick}
        className={`w-full flex justify-between items-start text-start p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <span className="font-medium">{faq.question}</span>
        <FaChevronDown
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ height }}
      >
        <div className="p-4 wrap-break-word">
          {faq.answer}
        </div>
      </div>
    </motion.div>
  );
}
