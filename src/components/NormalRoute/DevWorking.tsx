"use client";
import { useContext } from "react";
import { LayoutContext } from "../context";
import BlobsButton from "../Common/Blobsbutton";
import Link from "next/link";
import Image from "next/image";

export default function DeveloperIsWorking() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("LayoutContext must be used within a Provider");
  }

  const { translations, isRTL } = context;
  const t = translations.developerIsWorking;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen flex items-center justify-center transition-colors duration-500"
    >
      <div className="max-w-3xl text-center space-y-6">
        <Image
          width={500}
          height={300}
          src="https://res.cloudinary.com/de8yddexc/image/upload/v1747288109/resume/gzvauwc649f4udkk0flv.svg"
          alt="Under construction"
          className="mx-auto w-64 sm:w-80"
          style={{ filter: isRTL ? "none" : "none" }} // Keep normal, or flip if you want RTL mirror
        />

        <h1 className="text-3xl sm:text-4xl font-bold text-primary dark:text-indigo-400">
          {t.title}
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          {t.description}
        </p>
        <BlobsButton asChild className="cursor-pointer px-5 py-1">
          <Link href="/">{t.backToHome}</Link>
        </BlobsButton>
      </div>
    </div>
  );
}
