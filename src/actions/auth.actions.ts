"use server";

import { apiClient } from "@/lib/api";
import { LoginResponseData } from "@/types/user.type";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAccessToken } from "./auth";

// cookie save
export const setAuthCookies = async (
  accessToken?: string,
  refreshToken?: string,
) => {
  const cookieStore = await cookies();

  if (accessToken) {
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60,
    });
  }

  if (refreshToken) {
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 3,
    });
  }
};

// cookie delete
export const deleteAuthCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
};

// User Register
export const register = async ({
  name,
  email,
  phone,
  password,
  lang,
}: {
  name: string;
  email: string;
  phone: string;
  password: string;
  lang?: string;
}) => {
  return apiClient({
    endpoint: "/auth/register",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    params: lang ? { lang } : undefined,
    body: { name, email, phone, password, confirmPassword: password },
  });
};

// Login
export async function login({
  email,
  password,
  captchaToken,
}: {
  email: string;
  password: string;
  captchaToken?: string | null;
}) {
  if (process.env.NODE_ENV === "production") {
    const secret = process.env.RECAPTCHA_SERVER_KEY ?? process.env.NEXT_PUBLIC_RECAPCHA_SERVER_KEY;
    if (!secret || !captchaToken) {
      return { success: false, status: "error", message: "Please complete the reCAPTCHA challenge.", payload: null };
    }

    const verification = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: captchaToken }),
      cache: "no-store",
    }).then((response) => response.json() as Promise<{ success?: boolean }>);

    if (!verification.success) {
      return { success: false, status: "error", message: "reCAPTCHA verification failed. Please try again.", payload: null };
    }
  }

  const res = await apiClient<LoginResponseData>({
    endpoint: "/auth/login",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { email, password },
  });

  if (!res.success) {
    return res;
  }

  const { accessToken, refreshToken } = res.payload || {};
  await setAuthCookies(accessToken, refreshToken);

  return res;
}

// Logout
export async function handleLogout() {
  const token = await getAccessToken();
  await apiClient({
    endpoint: "/auth/logout",
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  await deleteAuthCookies();
  redirect("/login");
}

// Forgot password

export const forgotPassword = async ({
  email,
  lang,
}: {
  email: string;
  lang: string;
}) => {
  const res = await apiClient({
    endpoint: "/auth/forgot-password",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    params: { lang },
    body: { email },
  });

  return res;
};

// Reset Password
export const resetPassword = async ({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}) => {
  const res = await apiClient({
    endpoint: `/auth/reset-password/${token}`,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: { password: newPassword, confirmPassword: newPassword },
  });

  return res;
};
