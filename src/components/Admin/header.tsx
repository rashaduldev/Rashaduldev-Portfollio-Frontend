"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { handleLogout } from "@/actions/auth.actions";

import { Button } from "../ui/button";
import { Bell, Menu, Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function AdminHeader({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isLoggingOut, startLogout] = useTransition();
  const router = useRouter();

  const logout = () => {
    startLogout(async () => {
      try {
        await handleLogout();
      } catch (error) {
        if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) return;
        toast.error("Unable to log out. Please try again.");
      }
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white/95 px-4 backdrop-blur dark:bg-slate-900/95 md:px-8">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative hidden w-64 md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-9 bg-slate-50 border-none focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Right Side: Notifications & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" className="relative text-slate-500">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500"></span>
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu
          id="profile-dropdown"
          openDropdownId={openDropdownId}
          setOpenDropdownId={setOpenDropdownId}
        >
          <DropdownMenuTrigger>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full cursor-pointer">
              <Avatar className="h-9 w-9 border">
                <AvatarImage src="/admin-avatar.png" alt="Admin" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  AD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@portfolio.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings/seo")}>SEO Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={logout}
            >
              {isLoggingOut ? "Logging out…" : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
