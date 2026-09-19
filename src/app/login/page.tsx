import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoginForm from "@/components/Pages/Login/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Login to admin dashboard",
};

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-[100svh] w-full items-center justify-center">
        <div className="flex w-full items-center justify-center px-5 py-20 sm:py-10">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
}
