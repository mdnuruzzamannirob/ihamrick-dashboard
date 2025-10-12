"use client";
import { Mail } from "lucide-react";
import { useState } from "react";
export default function EmailField() {
  const [email, setEmail] = useState("");
  return (
    <div className="relative">
      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-12 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 font-poppins text-black placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
        required
      />
    </div>
  );
}
