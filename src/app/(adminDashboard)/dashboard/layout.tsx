'use client';

import { AdminHeader } from "@/components/Admin/header";
import ProtectedRoute from "@/components/Admin/ProtectedRoute";
import { AdminSidebar } from "@/components/Admin/sidebar";
import { ReactNode, useState } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 md:hidden">
            <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col flex-1 w-full">
        <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 md:p-8 pt-6">{children}</main>
      </div>
    </div>
    </ProtectedRoute>
    </>
  );
}
