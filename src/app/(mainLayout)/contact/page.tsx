import Contact from "@/components/Contact/Contact";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({ title: "Contact", description: "Contact Md Rashadul Islam about frontend development, full-stack solutions, UI implementation, performance optimization, or freelance work.", path: "/contact", keywords: ["hire frontend developer", "freelance Next.js developer"] });

const ContactPage = () => {
  return (
    <div>
      <Contact />
    </div>
  );
};

export default ContactPage;
