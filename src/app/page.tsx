"use client";

import type React from "react";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import BrandSection from "@/components/auth/Brand-section";
import Header from "@/components/auth/Header";
import EmailField from "@/components/auth/EmailField";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    // console.log("Login attempt:", { email, password });
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Side - Brand Section */}
      <BrandSection />

      {/* Right Side - Login Form */}
      <div className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-2/5 lg:px-8">
        <div className="w-full max-w-md">
          <Header title="Hello Again!" subtitle="Welcome Back" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <EmailField />

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-12 font-poppins text-black placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              onClick={() => router.replace("/dashboard")}
              className="h-12 w-full rounded-lg bg-black font-poppins text-base font-medium text-white transition-colors hover:bg-black/90"
            >
              Login
            </button>
          </form>
          <div className="text-end mt-[12]">
            <button
              type="button"
              className="font-poppins font-normal text-sm text-[#FF0000] hover:underline"
              onClick={() => router.push("/forget-password")}
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
