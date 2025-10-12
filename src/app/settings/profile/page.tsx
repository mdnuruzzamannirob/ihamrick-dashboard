"use client";

import { useState, useRef } from "react";
import { ArrowLeft, User, Camera } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { UserProfile } from "@/components/user-profile";
import Avatar from "@/assets/svg/Avatar.svg";
import Image from "next/image";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    firstName: "Hamrick",
    location: "New York",
    email: "hamrick@gmail.com",
    phoneNumber: "866 12 346 0780",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", formData);
    console.log("Profile image:", profileImage);
    // Add your save logic here
  };

  const handleChangePassword = () => {
    console.log("Change password clicked");
    // Add your password change logic here
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />
      <div className="min-h-screen flex-1 lg:ml-64 bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header with User Badge */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-poppins text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Profile
            </Link>

            <UserProfile />
          </div>

          {/* Profile Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
            {/* Profile Header */}
            <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="relative cursor-pointer group"
                  onClick={handleImageClick}
                  title="Click to upload profile image"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 sm:h-20 sm:w-20 relative overflow-hidden group-hover:opacity-80 transition-opacity">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        width={100}
                        height={100}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Image
                        src={Avatar}
                        width={100}
                        height={100}
                        alt="Avatar"
                      />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 flex h-5 w-5 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#DD7372] border-2 border-[#DD7372]">
                    <Camera className="h-5 w-5 sm:h-4 sm:w-4 text-white" />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div>
                  <h2 className="font-poppins text-xl font-semibold text-gray-900 sm:text-2xl">
                    Hamrick
                  </h2>
                  <p className="font-poppins text-sm text-gray-500 sm:text-base">
                    hamrick@gmail.com
                  </p>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                className="rounded-lg bg-black px-4 py-2 font-poppins text-sm font-medium text-white transition-colors hover:bg-gray-800 sm:px-6 sm:py-2.5"
              >
                Change Password
              </button>
            </div>

            {/* Personal Information Form */}
            <div>
              <h3 className="mb-6 font-poppins text-lg font-semibold text-gray-900">
                Personal Information
              </h3>

              <div className="space-y-6">
                {/* First Row: First Name & Location */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block font-poppins text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Write your full name"
                      className="w-full placeholder:text-gray-400 text-xs rounded-lg border border-gray-300 px-4 py-2.5 font-poppins  text-gray-900 transition-colors focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="mb-2 block font-poppins text-sm font-medium text-gray-700"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Write your location"
                      className="w-full  placeholder:text-gray-400 rounded-lg border border-gray-300 px-4 py-2.5 font-poppins text-xs text-gray-900 transition-colors focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>
                </div>

                {/* Second Row: Email & Phone Number */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block font-poppins text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="hamrick@gmail.com"
                      className="w-full placeholder:text-gray-400 rounded-lg border border-gray-300 px-4 py-2.5 font-poppins text-xs text-gray-900 transition-colors focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="mb-2 block font-poppins text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      placeholder="+42"
                      onChange={handleChange}
                      className="w-full placeholder:text-gray-400 rounded-lg border border-gray-300 px-4 py-2.5 font-poppins text-xs text-gray-900 transition-colors focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSaveChanges}
                  className="rounded-lg bg-black px-6 py-2.5 font-poppins text-sm font-medium text-white transition-colors hover:bg-gray-800"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
