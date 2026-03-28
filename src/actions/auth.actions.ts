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
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60,
    });
  }

  if (refreshToken) {
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: process.env.NODE_ENV === "production",
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
    body: { name, email, phone, password },
  });
};

// Login
export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
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
export async function handleLogout({ lang }: { lang: string }) {
  const token = await getAccessToken();
  await apiClient({
    endpoint: "/auth/logout",
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    params: { lang },
  });
  await deleteAuthCookies();
  redirect("/");
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
  email,
  newPassword,
  lang,
}: {
  email: string;
  otp: string;
  newPassword: string;
  lang: string;
}) => {
  const res = await apiClient({
    endpoint: "/api/auth/reset-password",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    params: { lang },
    body: { email, newPassword },
  });

  return res;
};
