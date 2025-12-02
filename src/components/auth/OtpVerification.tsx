"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useVerifyOtpMutation, useResendOtpMutation } from "../../../services/allApi"; // Import resendOtp mutation
import { RootState } from "../../../services/store";

export default function OTPVerification() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const email = useSelector((state: RootState) => state.email.email);
  const [verifyOtp, { isLoading, isError, isSuccess }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: resendLoading, isError: resendError, isSuccess: resendSuccess }] = useResendOtpMutation();

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }

    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      if (email) {
        try {
          const e = await verifyOtp({ email, otp: otpValue }).unwrap();
          console.log(e);
          router.replace("/set-password");
        } catch (error) {
          console.error("OTP verification failed:", error);
        }
      } else {
        console.error("Email is missing!");
      }
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    console.log(email)
    if (email) {
      console.log(email)
      try {
      const news =   await resendOtp({email:email} ).unwrap();
        console.log("Resend OTP successful",news);
      } catch (error) {
        console.error("Error resending OTP:", error);
      }
    } else {
      console.error("Email is missing for resending OTP!");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      {/* OTP Input Fields */}
      <div className="mb-6 flex gap-3 justify-center">
        {otp.map((digit, index) => (
          <div key={index} className="relative">
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="h-12 w-12 rounded-lg border border-gray-300 text-center font-poppins text-lg font-semibold text-gray-900 transition-all focus:border-[#111] focus:outline-none focus:ring-1 focus:ring-black sm:h-14 sm:w-14 sm:text-xl"
              aria-label={`OTP digit ${index + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={otp.join("").length !== 6 || isLoading}
        className="mb-4 w-full rounded-lg bg-black py-3 font-poppins text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5 sm:text-base"
      >
        {isLoading ? "Verifying..." : "Verify"}
      </button>

      {/* Resend Link */}
      <div className="text-center font-poppins text-sm text-gray-600 sm:text-base">
        Didn&apos;t receive the code?{" "}
        <button
          onClick={handleResend}
          className="font-semibold text-gray-900 transition-colors hover:text-blue-600 focus:outline-none focus:underline"
        >
          {resendLoading ? "Resending..." : "Click to resend OTP"}
        </button>
        {resendError && <p className="text-red-500">Failed to resend OTP. Try again.</p>}
        {resendSuccess && <p className="text-green-500">OTP resent successfully!</p>}
      </div>

      {/* Error Handling */}
      {isError && (
        <div className="text-red-500 text-center text-sm mt-4">
          Invalid OTP. Please try again.
        </div>
      )}
      {isSuccess && (
        <div className="text-green-500 text-center text-sm mt-4">
          OTP Verified successfully!
        </div>
      )}
    </div>
  );
}
