"use client";
import BrandSection from "@/components/auth/Brand-section";
import EmailField from "@/components/auth/EmailField";
import Header from "@/components/auth/Header";
import React from "react";
import { useRouter } from "next/navigation";
export default function ForgetPassword() {
  const router = useRouter();
  return (
    <div className="flex bg-white min-h-screen flex-col lg:flex-row">
      <BrandSection />
      {/* right-side */}

      <div className="flex flex-col h-screen w-full items-center justify-center px-6 py-12 lg:w-2/5 lg:px-8">
        <div className=" max-w-md">
          <Header
            title="Forgot Your Password?"
            subtitle="No worries, we'll send you reset instructions."
          />
          <form className=" space-y-4">
            <EmailField />
            <button
              type="submit"
              onClick={() => router.replace("/mail-check")}
              className="h-12 w-full rounded-lg bg-black font-poppins text-base font-medium text-white transition-colors hover:bg-black/90"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
