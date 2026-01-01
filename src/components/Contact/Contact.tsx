"use client";

import Image from "next/image";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { LayoutContext } from "@/components/context";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import emailjs from "emailjs-com";
import toast, { Toaster } from "react-hot-toast";

const SERVICE_ID = "service_4gd61io";
const TEMPLATE_ID = "template_ckn68lg";
const PUBLIC_KEY = "r3p7NL-T5QFcUdJy2";

const Contact = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider"
    );
  }

  const { isRTL, translations } = context;
  const t = translations.contact;

  useEffect(() => {
    setMounted(true);
  }, []);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    toast.promise(
      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY),
      {
        loading: "Sending...",
        success: "Message sent successfully!",
        error: "Failed to send message.",
      }
    );

    formRef.current.reset();
  };

  if (!mounted) return null;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={clsx(
        "min-h-screen transition-colors duration-300",
        resolvedTheme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
      )}
    >
      <Toaster position="top-right" />

      {/* Hero Section */}
      <section className="relative h-80 w-full">
        <Image
          src="https://res.cloudinary.com/de8yddexc/image/upload/v1747235020/resume/km4rzndw3nlyslgohcgi.jpg"
          alt="Contact Banner"
          fill
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <h1 className="text-4xl md:text-7xl font-bold text-gray-100">
            {t.heroTitle}
          </h1>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 mx-5 max-w-7xl md:mx-auto grid md:grid-cols-2 gap-10 items-start">
        {/* Info */}
        <div>
          <h2 className="text-3xl font-bold mb-4">{t.letsConnect}</h2>
          <p className="mb-6">{t.description}</p>
          <div className="space-y-4">
            <p>📧 {t.email}: rashadul.dev@gmail.com</p>
            <p>📞 {t.phone}: +8801603010103</p>
            <p>📍 {t.address}: Mirpur Dhaka, Bangladesh</p>
          </div>
        </div>

        {/* Form */}
        <div>
          <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder={t.namePlaceholder}
              required
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
            />
            <input
              type="text"
              name="phone"
              placeholder={t.phonePlaceholder}
              required
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
            />
            <input
              type="email"
              name="email"
              placeholder={t.emailPlaceholder}
              required
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
            />
            <textarea
              name="message"
              rows={4}
              placeholder={t.messagePlaceholder}
              required
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
            ></textarea>
            <Button type="submit" className="cursor-pointer">
              {t.sendButton}
            </Button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-linear-to-r from-green-400 to-blue-500 dark:from-purple-600 dark:to-pink-600 py-12 text-center text-gray-100 rounded-3xl">
        <h3 className="text-2xl md:text-4xl font-bold mb-4">{t.ctaTitle}</h3>
        <p className="text-lg">{t.ctaDescription}</p>
      </section>
    </div>
  );
};

export default Contact;
