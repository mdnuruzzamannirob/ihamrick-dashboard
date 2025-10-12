"use client";

import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ✅ REQUIRED
import { useRouter } from "next/navigation";

import BrandSection from "@/components/auth/Brand-section";
import Header from "@/components/auth/Header";
import PasswordField from "@/components/auth/PasswordField";

export default function SetPassword() {
  const router = useRouter();

  const handleReset = () => {
    toast.success("Password reset successful!");

    setTimeout(() => {
      router.replace("/");
    }, 1200); // Wait before redirect
  };

  return (
    <div className="flex bg-white min-h-screen flex-col lg:flex-row">
      <BrandSection />

      <div className="flex flex-col h-screen w-full items-center justify-center px-6 py-12 lg:w-2/5 lg:px-8">
        <div className="max-w-md w-full">
          <Header
            title="Set A New Password"
            subtitle="Your new password must be different from previously used passwords."
          />

          <div className="flex flex-col gap-y-4">
            <PasswordField placeholder="New Password" />
            <PasswordField placeholder="Confirm Password" />

            <button
              onClick={handleReset}
              className="mb-4 w-full rounded-lg bg-black py-3 font-poppins text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5 sm:text-base"
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
}
