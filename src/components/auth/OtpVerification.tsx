"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
export default function OTPVerification() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 5);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }

    setOtp(newOtp);

    // Focus last filled input or next empty one
    const nextIndex = Math.min(pastedData.length, 4);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = () => {
    const otpValue = otp.join("");
    if (otpValue.length === 5) {
      router.replace("/set-password");
    }
  };

  const handleResend = () => {
    console.log("Resending code...");
    // Add your resend logic here
    setOtp(["", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="">
      <div className="w-full max-w-md">
        <div className="">
          {/* OTP Input Fields */}
          <div className="mb-6 flex   sm:gap-3">
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
                  className="h-12 w-12 rounded-lg border-1 border-gray-300 text-center font-poppins text-lg font-semibold text-gray-900 transition-all focus:border-[#111] focus:outline-none focus:ring-1 focus:ring-black sm:h-14 sm:w-14 sm:text-xl"
                  aria-label={`OTP digit ${index + 1}`}
                />
              </div>
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={otp.join("").length !== 5}
            className="mb-4 w-full rounded-lg bg-black py-3 font-poppins text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5 sm:text-base"
          >
            Verify
          </button>

          {/* Resend Link */}
          <div className="text-center font-poppins text-sm text-gray-600 sm:text-base">
            Didn&apos;t receive the code?
            <button
              onClick={handleResend}
              className="font-semibold text-gray-900 transition-colors hover:text-blue-600 focus:outline-none focus:underline"
            >
              Click to resend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
