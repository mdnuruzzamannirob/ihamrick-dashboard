"use client";

import { Sidebar } from "@/components/sidebar";
import { UserProfile } from "@/components/user-profile";
import AboutUsEditor from "@/components/ui/about-us-editor";

export default function AboutUs() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />
      <div className="min-h-screen justify-center items-center flex-1 lg:ml-64 bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with User Badge */}
        <div className="mb-8 flex items-center justify-end">
          <UserProfile />
        </div>

        <AboutUsEditor title="Privacy Policy" />
      </div>
    </div>
  );
}
