"use client";

import { useContext } from "react";
import { LayoutContext } from "./context";
import CountUp from "react-countup";
import clsx from "clsx";
import { useInView } from "react-intersection-observer";

const Achievements = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider",
    );
  }

  const { translations, isRTL } = context;
  const achievements = translations.achievements || {};
  const stats = achievements.stats || [
    { value: 1037, label: "Project Completed" },
    { value: 20, label: "Award Winner" },
    { value: 90, label: "Client Satisfaction" },
    { value: 15, label: "Year of Experience" },
  ];

  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <section ref={ref} className="py-16 transition-colors duration-300">
      <div className="text-center mb-10">
        <h2 className="mt-2">{achievements?.title || "Achievements"}</h2>
      </div>

      <div
        className={clsx(
          "grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
          isRTL ? "direction-rtl text-right" : "text-left",
        )}
      >
        {stats?.map((item, idx) => (
          <div
            key={idx}
            className="rounded border border-gray-300 dark:border-gray-700 p-6 flex flex-col items-center text-center transition-transform hover:scale-105 hover:border-primary duration-300"
          >
            <div className="text-4xl font-bold mb-2">
              {inView ? (
                <>
                  <CountUp
                    end={item.value}
                    duration={2}
                    decimals={item.value % 1 !== 0 ? 1 : 0}
                    formattingFn={(val) => {
                      if (item.value < 10 && item.value % 1 === 0) {
                        return `0${Math.floor(val)}`;
                      }
                      return val.toString();
                    }}
                  />
                  {idx !== 2 && "+"} {/* Only exclude + for satisfaction (%) */}
                  {idx === 2 && "%"}
                </>
              ) : (
                "0"
              )}
            </div>
            <p className="text-sm">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Achievements;
