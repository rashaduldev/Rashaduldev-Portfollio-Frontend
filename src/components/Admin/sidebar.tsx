"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  MessageSquare,
  Settings,
  BarChart3,
  Globe,
  FolderCode,
  ArrowLeft,
  X,
  Subscript,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: FolderCode, label: "Projects", href: "/dashboard/projects" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Subscript, label: "Subscribers", href: "/dashboard/subscribers" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Globe, label: "Localization", href: "/dashboard/localization" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: ArrowLeft, label: "Back To Home", href: "/" },
];

type SidebarProps = {
  mobile?: boolean;
  open?: boolean;
  onClose?: () => void;
};

export function AdminSidebar({
  mobile = false,
  open = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  /* =======================
     Desktop Sidebar
  ======================== */
  if (!mobile) {
    return (
      <aside className="h-screen w-64 border-r bg-white dark:bg-slate-900">
        <SidebarContent pathname={pathname} />
      </aside>
    );
  }

  /* =======================
     Mobile Drawer Sidebar
  ======================== */
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 bg-white dark:bg-slate-900 transform transition-transform duration-300 md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close Button */}
        <div className="flex items-center justify-between p-4 border-b">
          <Image
            src="https://res.cloudinary.com/de8yddexc/image/upload/v1765567136/vwleekmngplrdpdo1q9s.svg"
            width={90}
            height={20}
            alt="Logo"
          />
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <SidebarContent pathname={pathname} onClose={onClose} />
      </aside>
    </>
  );
}

/* =======================
   Sidebar Inner Content
======================== */
function SidebarContent({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full flex-col px-3 py-4">
      {/* Logo (desktop only) */}
      {!onClose && (
        <div className="mb-4 flex justify-center">
          <Link href="/dashboard">
            <Image
              src="https://res.cloudinary.com/de8yddexc/image/upload/v1765567136/vwleekmngplrdpdo1q9s.svg"
              width={100}
              height={20}
              alt="Logo"
              priority
            />
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center rounded-lg px-4 py-2 transition",
                isActive
                  ? "bg-slate-200 font-medium text-slate-900 dark:bg-slate-800 dark:text-white"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
