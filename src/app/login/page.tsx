import LoginForm from "@/components/page/login/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login - Dashboard",
  description: "Secure admin login to manage portfolio",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <LoginForm />
    </div>
  );
}
