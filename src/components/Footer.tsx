"use client";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState, useContext } from "react";
import { Input } from "@/components/ui/input";
import { LayoutContext } from "./context";
import { FaDev, FaGithub, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FooterSection } from "@/types/translations";
import { SiCodewars } from "react-icons/si";
import { Typography } from "./ui/Typography";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { subscribeNewsletter } from "@/actions/subscribers/subscribers";
import { subscribeSchema } from "@/schemas/subscriber.schema";
type ExpectedLayoutContextValue = {
  translations: {
    footer: FooterSection;
  } | null;
};
type NavLinkItem = {
  key: string;
  href: string;
  defaultText: string;
  translationKey: keyof FooterSection;
};
const companyLinks: NavLinkItem[] = [
  {
    key: "projects",
    href: "/projects",
    defaultText: "Projects",
    translationKey: "projects",
  },
  {
    key: "contact",
    href: "/contact",
    defaultText: "Contact",
    translationKey: "contact",
  },
  {
    key: "privacy",
    href: "/cookies-policy",
    defaultText: "Privacy Policy",
    translationKey: "privacy",
  },
  {
    key: "terms",
    href: "/terms",
    defaultText: "Terms of Service",
    translationKey: "terms",
  },
];

const resourceLinks: NavLinkItem[] = [
  {
    key: "articles",
    href: "/articles",
    defaultText: "Articles",
    translationKey: "articles",
  },
  {
    key: "help",
    href: "/help-center",
    defaultText: "Help Center",
    translationKey: "help",
  },
];
type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

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
    LayoutContext as unknown as React.Context<
      ExpectedLayoutContextValue | undefined
    >,
  );
  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider",
    );
  }
  const translations = context.translations;

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const getTranslation = (
    key: keyof FooterSection,
    defaultText: string,
  ): string => translations?.footer?.[key] || defaultText;

  const mutation = useMutation<any, any, string>({
    mutationFn: (email: string) => subscribeNewsletter({ email }),

    onSuccess: () => {
      toast.success("Thank you for subscribing!");
      setEmail("");
      mutation.reset();
    },

    onError: (error: any) => {
      const message =
        error?.message || error?.cause?.code || "Server connection failed 🚫";

      toast.error(message);
    },
  });

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate using Zod
    const result = subscribeSchema.safeParse({ email });

    if (!result.success) {
      // Safely extract first error message
      const firstError = result.error?.issues?.[0]?.message || "Invalid input";
      setError(firstError);
      return;
    }

    setError(null); // clear previous errors
    mutation.mutate(email);
  };

  const renderLinkSection = (
    titleKey: keyof FooterSection,
    defaultTitle: string,
    links: NavLinkItem[],
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
    <footer className="w-full py-12 bg-background text-foreground border-t-2">
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
          {renderLinkSection(
            "company",
            "Company",
            companyLinks.filter((l) => l.key !== "terms"),
          )}
        </div>

        <div className="hidden md:block">
          {renderLinkSection("resources", "Resources", resourceLinks)}
        </div>
        <div>
          <Typography
            as="h2"
            size="lg"
            color="foreground"
            weight="semiBold"
            className="mb-2"
          >
            {getTranslation("follow", "Follow Us")}
          </Typography>
          <div className="flex flex-row gap-4 mt-2">
            <Link
              href="https://www.codewars.com/users/rashaduldev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit my Codewars profile"
              className="hover:text-primary-hover transition-colors duration-200"
            >
              <SiCodewars className="text-xl" />
            </Link>
            <Link
              href="https://github.com/rashaduldev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit my GitHub profile"
              className="hover:text-primary-hover transition-colors duration-200"
            >
              <FaGithub className="text-xl" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/rashaduldev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit my LinkedIn profile"
              className="hover:text-primary-hover transition-colors duration-200"
            >
              <FaLinkedinIn className="text-xl" />
            </Link>
            <Link
              href="https://app.daily.dev/rashaduldev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit my daily dev profile"
              className="hover:text-primary-hover transition-colors duration-200"
            >
              <FaDev className="text-xl" />
            </Link>
          </div>
        </div>

        {/* Newsletter - always visible */}
        <div>
          <Typography
            as="h3"
            size="lg"
            color="foreground"
            weight="semiBold"
            className="mb-2"
          >
            {getTranslation("newsletter", "Subscribe to My Newsletter")}
          </Typography>
          <Typography size="sm" color="foreground" className="mb-4">
            {getTranslation(
              "newsletterDesc",
              "Get the latest updates and offers.",
            )}
          </Typography>
          <form
            onSubmit={handleEmailSubmit}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div>
              <Input
                type="email"
                placeholder={getTranslation(
                  "emailPlaceholder",
                  "Enter your email",
                )}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 rounded-md text-gray-900 w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-primary"
              />
              {error && (
                <Typography size="sm" color="destructive" className="mt-1">
                  {error}
                </Typography>
              )}
            </div>
            <Button
              type="submit"
              className="h-9 w-fit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                "Subscribing..."
              ) : (
                <>
                  <Mail className="h-4 mr-2" />
                  {getTranslation("subscribe", "Subscribe")}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
      <Typography
        size="sm"
        color="muted_foreground"
        className="mt-8 text-center"
      >
        © {new Date().getFullYear()} rashaduldev. All rights reserved.
      </Typography>
    </footer>
  );
}
