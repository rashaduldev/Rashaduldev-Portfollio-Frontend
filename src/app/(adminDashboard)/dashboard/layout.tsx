import { AdminHeader } from "@/components/Admin/header";
import { AdminSidebar } from "@/components/Admin/sidebar";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col flex-1 w-full">
        <AdminHeader />
        <main className="p-4 md:p-8 pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}