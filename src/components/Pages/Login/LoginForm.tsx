"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import * as z from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";

import { login } from "@/actions/auth.actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DynamicHeading } from "@/components/Common/DynamicHeading";
import { ControlledInput } from "@/components/Common/ControlledInput";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [recaptchaOk, setRecaptchaOk] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    setError,
  } = form;

  // ✅ reCAPTCHA handler
  const handleCaptcha = async (token: string | null) => {
    if (!token) {
      setRecaptchaOk(false);
      return;
    }

    try {
      // optional: verify from backend
      setRecaptchaOk(true);
    } catch {
      setRecaptchaOk(false);
    }
  };

  // ✅ Submit
  const onSubmit = async (values: LoginValues) => {
    if (!recaptchaOk) {
      toast.error("Please verify reCAPTCHA");
      return;
    }

    try {
      const res = await login(values);

      if (!res.success) {
        setError("root", {
          type: "manual",
          message: res.message || "Login failed",
        });
        return;
      }

      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const siteKey = process.env.NEXT_PUBLIC_RECAPCHA_CLIENT_KEY as string;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <DynamicHeading
          title="Login"
          description="Enter your credentials to access dashboard"
        />
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <ControlledInput
            name="email"
            label="Email"
            control={control}
            requiredMark="*"
            placeholder="Enter your email"
          />
          <div className="relative">
          <ControlledInput
            name="password"
            requiredMark="*"
            label="Password"
            type={showPassword ? "text" : "password"}
            control={control}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute cursor-pointer top-7 right-3"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Eye className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
          {/* Error */}
          {form.formState.errors.root && (
            <p className="text-sm text-red-500">
              {form.formState.errors.root.message}
            </p>
          )}

          {/* reCAPTCHA */}
          <div className="flex justify-center">
            <ReCAPTCHA sitekey={siteKey} onChange={handleCaptcha} />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={!recaptchaOk || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  );
}