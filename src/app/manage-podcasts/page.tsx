import React from "react";
import { Sidebar } from "@/components/sidebar";
export default function page() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <span className="text-red-500 flex-1 text-2xl text-center justify-center items-center">
        Manage Podcasts
      </span>
    </div>
  );
}
