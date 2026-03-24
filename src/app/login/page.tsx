"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import ReCAPTCHA from "react-google-recaptcha";
import { recapchaTokenVarification } from "@/utils/auth";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Static credentials
const STATIC_CREDENTIALS = {
  email: "rashadul.dev@gmail.com",
  password: "@Rashadul4256",
};

export default function LoginPage() {
  const router = useRouter();
  const [recaptchaStatus, setRecaptchaStatus] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleCapcha = async (value: string | null) => {
    if (!value) return;

    try {
      const res = await recapchaTokenVarification(value);

      if (res.success) {
        setRecaptchaStatus(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sitekey = process.env.NEXT_PUBLIC_RECAPCHA_CLIENT_KEY;

  function onSubmit(values: z.infer<typeof loginSchema>) {
    if (
      values.email === STATIC_CREDENTIALS.email &&
      values.password === STATIC_CREDENTIALS.password
    ) {
      const token =
        "admin-token-" + Math.random().toString(36).substring(2, 15);
      Cookies.set("token", token, { expires: 1 });
      toast.success("Login successful!");
      router.push("/dashboard");
    } else {
      toast.error("Invalid email or password");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <Toaster position="top-right" />
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Only Admin Signin
          </CardTitle>
          <CardDescription>
            Enter credentials to manage portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center mt-3">
                <ReCAPTCHA
                  sitekey={sitekey as string}
                  onChange={handleCapcha}
                />
              </div>
              <Button
                disabled={recaptchaStatus ? false : true}
                type="submit"
                className="w-full cursor-pointer"
              >
                Sign In
              </Button>
            </form>
          </Form>
          <Link
            href="/"
            className="mt-4 w-fit mx-auto hover:underline text-primary flex items-center gap-2 justify-center"
          >
            <IoArrowBack />
            Back To Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
