"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { UserProfile } from "@/components/user-profile";
import AboutUsEditor from "@/components/ui/about-us-editor";

export default function AboutUs() {
  const [formData, setFormData] = useState({
    firstName: "Hamrick",
    location: "New York",
    email: "hamrick@gmail.com",
    phoneNumber: "866 12 346 0780",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    // Add your save logic here
  };

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
