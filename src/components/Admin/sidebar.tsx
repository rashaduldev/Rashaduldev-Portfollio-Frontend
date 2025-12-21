"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  User,
  MessageSquare,
  Settings,
  BarChart3,
  Globe,
  FolderCode,
  ArrowLeft,
} from "lucide-react"

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: FolderCode, label: "Projects", href: "/dashboard/projects" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: FolderCode, label: "Skills", href: "/dashboard/skills" },
  { icon: FolderCode, label: "Projects", href: "/dashboard/projects" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Globe, label: "Localization", href: "/dashboard/localization" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: ArrowLeft, label: "Back To Home", href: "/" },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white dark:bg-slate-900">
      <div className="flex h-full flex-col px-3 py-4">
        {/* Logo */}
        <div className="mb-2 flex items-center justify-center">
          <Link href="/dashboard">
            <Image
              src="https://res.cloudinary.com/de8yddexc/image/upload/v1765567136/vwleekmngplrdpdo1q9s.svg"
              width={100}
              height={20}
              alt="My Brand Logo"
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-lg px-4 py-2 transition
                  ${
                    isActive
                      ? "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white font-medium"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? "text-primary" : ""
                  }`}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
