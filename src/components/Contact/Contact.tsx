"use client";

import Image from "next/image";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { LayoutContext } from "@/components/context";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { sendContactMessage } from "@/actions/contact/contact";
import { ControlledPhoneInput } from "../Common/ControlledPhoneInput";
import { ControlledInput } from "../Common/ControlledInput";
import { ControlledTextarea } from "../Common/ControlledTextarea";
import BlobsButton from "../Common/Blobsbutton";

interface ContactFormValues {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
}

const Contact = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider",
    );
  }

  const { isRTL, translations } = context;
  const t = translations.contact;

  useEffect(() => setMounted(true), []);

  // ✅ Zod schema
  const contactSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    phoneNumber: z
      .string()
      .min(1, { message: "Phone is required" })
      .refine((val) => isValidPhoneNumber(val), {
        message: "Invalid phone number",
      }),
    message: z.string().min(1, { message: "Message is required" }),
  });

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    setError, // ✅ important
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
  });

  // ✅ UPDATED SUBMIT HANDLER
  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    try {
      const res = await sendContactMessage({
        name: data.name,
        email: data.email,
        phone: data.phoneNumber,
        message: data.message,
      });

      // ❌ Backend validation error
      if (!res?.success) {
        setError("root", {
          type: "server",
          message: res?.message || "Failed to send message",
        });
        return;
      }

      // ✅ Success
      toast.success(res?.message || "Message sent successfully!");
      reset();
    } catch (err: any) {
      // ❌ Server/network error
      setError("root", {
        type: "server",
        message: err?.message || "Server connection failed 🚫",
      });
    }
  };

  if (!mounted) return null;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={clsx(
        "min-h-screen transition-colors duration-300",
        resolvedTheme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900",
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <ControlledInput
              name="name"
              requiredMark="*"
              label="Name"
              control={control}
              placeholder="Enter your name"
            />

            <ControlledInput
              name="email"
              requiredMark="*"
              label="Email"
              control={control}
              placeholder="Enter your email"
            />

            <ControlledPhoneInput
              name="phoneNumber"
              control={control}
              requiredMark="*"
              label={t.phonePlaceholder}
              setValue={setValue}
              defaultCountry="BD"
              readOnlyCountryCode
            />

            <ControlledTextarea
              name="message"
              requiredMark="*"
              control={control}
              label="Message"
              placeholder="Enter your message"
            />

            {/* 🔴 GLOBAL ERROR (ABOVE BUTTON) */}
            {errors.root && (
              <p className="text-red-500 text-sm font-medium">
                {errors.root.message}
              </p>
            )}

            <BlobsButton
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer px-5 py-1"
            >
              {isSubmitting ? "Sending..." : t.sendButton}
            </BlobsButton>
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
