"use client";
import BlobsButton from "@/components/Common/Blobsbutton";
import { Mail } from "lucide-react";
import { useContext } from "react";
import { Input } from "@/components/ui/input";
import { LayoutContext } from "./context";
import { FaDev, FaGithub, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FooterSection } from "@/types/translations";
import { SiCodewars } from "react-icons/si";
import toast from "react-hot-toast";
import { subscribeNewsletter } from "@/actions/subscribers/subscribers";
import { subscribeSchema } from "@/schema/subscriber.schema";
import { Typography } from "./ui/Typography";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CelebrationButton from "./Common/CelebrationButton";

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

type NewsletterFormValues = {
  email: string;
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

  const getTranslation = (
    key: keyof FooterSection,
    defaultText: string,
  ): string => translations?.footer?.[key] || defaultText;

  // React Hook Form setup
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    try {
      const res = await subscribeNewsletter({ email: data.email });

      if (!res.success) {
        setError("email", {
          type: "server",
          message: res.message || "Failed to subscribe",
        });
        return;
      }

      toast.success("Thank you for subscribing!");
      reset();
    } catch (err: any) {
      setError("email", {
        type: "server",
        message: err?.message || "Server connection failed 🚫",
      });
    }
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
            <div className="flex-1">
              <Link href="/">
                <Image
                  src="https://res.cloudinary.com/de8yddexc/image/upload/v1765567136/vwleekmngplrdpdo1q9s.svg"
                  width={100}
                  height={20}
                  style={{ width: 100, height: 20 }}
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
          <Link href="/" className="mb-4 block">
            <Image
              src="https://res.cloudinary.com/de8yddexc/image/upload/v1765567136/vwleekmngplrdpdo1q9s.svg"
              width={100}
              height={20}
              style={{ width: 100, height: 20 }}
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
            {[
              { href: "https://www.codewars.com/users/rashaduldev", label: "Visit my Codewars profile", icon: <SiCodewars className="text-xl" />, color: "bg-red-500" },
              { href: "https://github.com/rashaduldev", label: "Visit my GitHub profile", icon: <FaGithub className="text-xl" />, color: "bg-gray-900" },
              { href: "https://www.linkedin.com/in/rashaduldev", label: "Visit my LinkedIn profile", icon: <FaLinkedinIn className="text-xl" />, color: "bg-blue-600" },
              { href: "https://app.daily.dev/rashaduldev", label: "Visit my daily dev profile", icon: <FaDev className="text-xl" />, color: "bg-black" },
            ].map(({ href, label, icon, color }) => (
              <CelebrationButton
                key={href}
                className="h-9 w-9 rounded-full bg-muted"
                hoverBackgroundClassName={color}
              >
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-full w-full items-center justify-center text-foreground transition-colors group-hover:text-white"
                >
                  {icon}
                </Link>
              </CelebrationButton>
            ))}
          </div>
        </div>

        {/* Newsletter */}
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
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    type="email"
                    placeholder={getTranslation(
                      "emailPlaceholder",
                      "Enter your email",
                    )}
                    {...field}
                    className="px-4 py-2 rounded-md w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-primary"
                  />
                )}
              />
              {errors.email && (
                <Typography size="sm" color="destructive" className="mt-1">
                  {errors.email.message}
                </Typography>
              )}
            </div>
            <BlobsButton type="submit" disabled={isSubmitting} className="h-9 w-fit px-4">
              {isSubmitting ? (
                "Subscribing..."
              ) : (
                <>
                  <Mail className="h-4 mr-2" />
                  {getTranslation("subscribe", "Subscribe")}
                </>
              )}
            </BlobsButton>
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
