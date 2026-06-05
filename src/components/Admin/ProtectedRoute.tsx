'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; 

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Login stores the JWT in the `accessToken` cookie (see auth.actions.ts).
    const cookieToken = Cookies.get("accessToken");
    const localToken = localStorage.getItem("accessToken");

    if (!localToken && !cookieToken) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <div className="flex min-h-screen justify-center items-center">Loading...</div>;

  return <>{children}</>;
}
