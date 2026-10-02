"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((module) => module.DotLottieReact),
  { ssr: false },
);

type LottieAnimationProps = {
  src: string;
  className?: string;
};

export default function LottieAnimation({ src, className }: LottieAnimationProps) {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "160px" });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("relative overflow-hidden", className)}
    >
      {!reduceMotion && inView ? (
        <DotLottieReact src={src} autoplay loop className="h-full w-full" />
      ) : (
        <div className="h-full w-full rounded-full bg-primary/5" />
      )}
    </div>
  );
}
