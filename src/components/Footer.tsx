"use client";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState, useContext } from "react";
import { Input } from "@/components/ui/input";
import { LayoutContext } from "./context"; 
import { FaDev, FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FooterSection } from "@/types/translations";
interface ExpectedLayoutContextValue {
  translations: {
    footer: FooterSection;
  } | null;
}
interface NavLinkItem {
  key: string;
  href: string;
  defaultText: string;
  translationKey: keyof FooterSection; 
}
const companyLinks: NavLinkItem[] = [
  { key: "projects", href: "/projects", defaultText: "Projects", translationKey: "projects" },
  { key: "contact", href: "/contact", defaultText: "Contact", translationKey: "contact" },
  { key: "privacy", href: "/cookies-policy", defaultText: "Privacy Policy", translationKey: "privacy" },
  { key: "terms", href: "/terms", defaultText: "Terms of Service", translationKey: "terms" },
];

const resourceLinks: NavLinkItem[] = [
  { key: "articles", href: "/articles", defaultText: "Articles", translationKey: "articles" },
  { key: "help", href: "/help-center", defaultText: "Help Center", translationKey: "help" },
];
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href === "/" && pathname === "/");

  const baseClasses = "hover:text-primary transition-colors duration-200";
  const activeClasses = "text-primary font-bold";

  return (
    <li>
      <Link
        href={href}
        className={`${baseClasses} ${isActive ? activeClasses : ""}`}
      >
        {children}
      </Link>
    </li>
  );
};

export default function Footer() {
  const context = useContext<ExpectedLayoutContextValue | undefined>(
    LayoutContext as unknown as React.Context<ExpectedLayoutContextValue | undefined>
  );
  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider"
    );
  }
  const translations = context.translations;

  const [email, setEmail] = useState("");

  const getTranslation = (
    key: keyof FooterSection, 
    defaultText: string
  ): string => translations?.footer?.[key] || defaultText;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(
        `${getTranslation(
          "subscribeSuccess",
          "Thank you for subscribing with email:"
        )} ${email}`
      );
      setEmail("");
    }
  };

  const renderLinkSection = (
    titleKey: keyof FooterSection,
    defaultTitle: string,
    links: NavLinkItem[]
  ) => (
    <div>
      <ul className="space-y-2">
        {links.map((link) => (
          <NavLink key={link.key} href={link.href}>
            {getTranslation(link.translationKey, link.defaultText)}
          </NavLink>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="w-full py-12 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 border-t-2">
      <div className="section-container grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        
        <div className="block md:hidden">
          <div className="flex flex-row gap-8">
            {/* Company - Mobile */}
            <div className="flex-1">
              {/* Logo/Brand */}
              <Link href="/">
                <Image
                  src="https://res.cloudinary.com/de8yddexc/image/upload/v1765567136/vwleekmngplrdpdo1q9s.svg"
                  width={100}
                  height={20}
                  alt="My Brand Logo"
                  priority
                />
              </Link>
              <ul className="space-y-2 mt-4">
                  {companyLinks.map((link) => (
                      <NavLink key={link.key} href={link.href}>
                          {getTranslation(link.translationKey, link.defaultText)}
                      </NavLink>
                  ))}
              </ul>
            </div>
            <div className="flex-1">
              {renderLinkSection("resources", "Resources", resourceLinks)}
            </div>
          </div>
        </div>
        <div className="hidden md:block">
            {/* Logo/Brand */}
            <Link href="/" className="mb-4 block">
                <Image
                    src="https://res.cloudinary.com/de8yddexc/image/upload/v1765567136/vwleekmngplrdpdo1q9s.svg"
                    width={100}
                    height={20}
                    alt="My Brand Logo"
                    priority
                />
            </Link>
            {renderLinkSection("company", "Company", companyLinks.filter(l => l.key !== "terms"))}
        </div>

        {/* Resources - Desktop (Hidden on mobile) */}
        <div className="hidden md:block">
          {renderLinkSection("resources", "Resources", resourceLinks)}
        </div>

        {/* Follow Us - always visible */}
        <div>
          <h3 className="font-semibold text-lg">
            {getTranslation("follow", "Follow Us")}
          </h3>
          <div className="flex flex-row gap-4 mt-2">
            <Link
              href="https://www.facebook.com/rashaduldev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-hover transition-colors duration-200"
            >
              <FaFacebookF className="text-xl" />
            </Link>
            <Link
              href="https://github.com/rashaduldev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-hover transition-colors duration-200"
            >
              <FaGithub className="text-xl" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/rashaduldev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-hover transition-colors duration-200"
            >
              <FaLinkedinIn className="text-xl" />
            </Link>
            <Link
              href="https://app.daily.dev/rashaduldev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-hover transition-colors duration-200"
            >
              <FaDev className="text-xl" />
            </Link>
          </div>
        </div>

        {/* Newsletter - always visible */}
        <div>
          <h3 className="font-semibold text-lg">
            {getTranslation("newsletter", "Subscribe to My Newsletter")}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            {getTranslation(
              "newsletterDesc",
              "Get the latest updates and offers."
            )}
          </p>
          <form
            onSubmit={handleEmailSubmit}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Input
              type="email"
              placeholder={getTranslation(
                "emailPlaceholder",
                "Enter your email"
              )}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-md text-gray-900 w-full sm:w-64 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-primary"
              required
            />
            <Button type="submit" className="cursor-pointer">
              <Mail className="w-4 h-4 mr-2" />
              {getTranslation("subscribe", "Subscribe")}
            </Button>
          </form>
        </div>
      </div>
      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        {getTranslation(
          "copyright",
          `© ${new Date().getFullYear()} rashaduldev. All rights reserved.`
        )}
      </p>
    </footer>
  );
}