"use client";

import { useContext } from "react";
import { LayoutContext } from "@/components/context";
import { Service } from "@/types/translations";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

export default function ServicesCarousel() {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider",
    );
  }

  const { translations } = context;
  const services = (translations?.services?.items as Service[]) || [];

  if (services.length === 0) {
    return (
      <section className="w-full py-12 mx-auto">
        <h2 className="mb-8 text-center text-2xl font-semibold">
          {translations.services?.title || "Services I Offer"}
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400">
          No services available at the moment.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full py-12 mx-auto">
      <h2 className="mb-8 text-center">
        {translations.services?.title || "Services I Offer"}
      </h2>

      <Carousel className="relative w-full" opts={{ align: "start" }}>
        <CarouselContent className="-ml-2">
          {services.map((service, idx) => (
            <CarouselItem
              key={service.title + idx}
              className="pl-2 md:basis-1/2 lg:basis-1/3"
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: idx * 0.1,
                }}
                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {service.image && (
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={160}
                    height={160}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                )}
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-300 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation */}
        <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 left-0 z-10 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
          ◀
        </CarouselPrevious>
        <CarouselNext className="absolute top-1/2 -translate-y-1/2 right-0 z-10 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
          ▶
        </CarouselNext>
      </Carousel>
    </section>
  );
}
