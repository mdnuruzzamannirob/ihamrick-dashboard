"use client";
// src/components/auth/PasswordField.tsx
import { Eye, EyeOff, Lock } from "lucide-react";
import React, { useState } from "react";

interface PasswordFieldProps {
  placeholder: string;
  value: string; // Renamed from `password` to `value` for better clarity
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // This is the handler from the parent
  isConfirmPasswordField?: boolean; // Optional prop to check if this is the confirm password field
}

export default function PasswordField({
  placeholder,
  value,
  onChange,
  isConfirmPasswordField = false,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange} // Call the `onChange` function from the parent
        className="h-12 text-xs font-normal w-full font-poppins rounded-lg border border-gray-300 bg-white pl-10 pr-12 text-black placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
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
  );
}
