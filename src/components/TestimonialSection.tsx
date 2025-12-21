"use client"
import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { LayoutContext } from "./context";
import Image from "next/image";

type Testimonial = {
  image: string;
  name: string;
  username: string;
  quote: string;
  highlight: string;
};

type TranslationsType = {
  testimonialsSection: {
    testimonialHeading: string;
    trustedClients: string;
    testimonials: Testimonial[];
  };
};

type LayoutContextType = {
  translations: TranslationsType;
  isRTL: boolean;
};

const TestimonialSection: React.FC = () => {
  const context = useContext(LayoutContext) as LayoutContextType;

  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider"
    );
  }

  const { translations, isRTL } = context;
  const { testimonialsSection } = translations;

  return (
    <section
      className="py-16 transition-colors duration-500 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/de8yddexc/image/upload/v1750764780/abstract-liquid-shape-black-white-260nw-2353716569_jlmxxc.webp')",
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/50 dark:bg-black/70 backdrop-blur-sm z-0" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h2 className="mb-4 transition-colors duration-500">
          {testimonialsSection.testimonialHeading}
        </h2>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 transition-colors duration-500">
          {testimonialsSection.trustedClients}
        </p>

        <Swiper
          modules={[EffectCoverflow, Autoplay, Pagination]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{ clickable: true }}
          className="mx-auto"
        >
          {testimonialsSection.testimonials.map((testimonial, index) => (
            <SwiperSlide
              key={index}
              className="border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center transition-colors duration-500"
              style={{
                width: "380px",
                transition: "transform 0.3s ease, background-color 0.5s ease",
              }}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 relative">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name || "Client testimonial image"}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover opacity-80 dark:opacity-70 transition-opacity duration-500"
                />
              </div>
              <p className="italic text-sm transition-colors duration-500">
                &quot;{testimonial.quote}{" "}
                <span className="font-semibold">{testimonial.highlight}</span>
                &quot;
              </p>
              <h3 className="font-bold text-xl mb-2 text-lightText dark:text-darkText transition-colors duration-500">
                {testimonial.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-500">
                {testimonial.username}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialSection;
