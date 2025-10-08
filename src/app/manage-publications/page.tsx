import { Sidebar } from "@/components/sidebar";
import React from "react";

export default function ManagePublications() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="text-red-500 lg:ml-89 flex-1 text-center justify-center items-center">
        Manage Publications
      </div>
    </div>
  );
}
