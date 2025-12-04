"use client";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux"; // Import useSelector for accessing Redux state
import { useResetPasswordMutation } from "../../../../services/allApi";
import BrandSection from "@/components/auth/Brand-section";
import Header from "@/components/auth/Header";
import PasswordField from "@/components/auth/PasswordField";
import { RootState } from "../../../../services/store"; // Ensure this is the correct path

export default function SetPassword() {
  const router = useRouter();

  // Access email and OTP from Redux state
  const { email, otp } = useSelector((state: RootState) => state.email);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Call the resetPassword API hook
  const [resetPassword, { isLoading, isSuccess, error }] = useResetPasswordMutation();

  const handleReset = async () => {
    try {
      const emailString = email ? email : "";
      const otpString = otp !== null && otp !== undefined ? String(otp) : "";
      const response = await resetPassword({
        email: emailString,
        newPassword,
        confirmPassword,
        otp: otpString, // Pass the stringified OTP here
      }).unwrap();

      if (response.success) {
        toast.success("Password reset successful!");
        setTimeout(() => {
          router.replace("/"); // Redirect after successful reset
        }, 1200);
      } else {
        toast.error(response.message); // Handle failure response
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred while resetting your password.");
    }
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
            <PasswordField
              placeholder="New Password"
              password={newPassword}
              setPassword={setNewPassword}
            />
            <PasswordField
              placeholder="Confirm Password"
              password={confirmPassword}
              setPassword={setConfirmPassword}
              isConfirmPasswordField
            />

            <button
              onClick={handleReset}
              className="mb-4 w-full rounded-lg bg-black py-3 font-poppins text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5 sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
}
