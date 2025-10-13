"use client";

import { Sidebar } from "@/components/sidebar";
import { UserProfile } from "@/components/user-profile";
import PasswordField from "@/components/auth/PasswordField";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import Button from "@/components/ui/button";
export default function ChangePasswordPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />
      <div className="min-h-screen justify-center items-center flex-1 lg:ml-64 bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header with User Badge */}
          <div className="mb-8 flex items-center justify-end">
            <UserProfile />
          </div>

          {/* Profile Card */}
          <div className=" rounded-xl jusitfy-center items-center  bg-white p-6 shadow-sm sm:p-8">
            {/* Profile Header */}

            {/* Personal Information Form */}
            <div>
              <h3 className="mb-6 font-poppins text-lg font-semibold text-gray-900">
                Change Password
              </h3>

              <div className="space-y-6">
                {/* First Row: First Name & Location */}
                <div className="flex flex-col gap-y-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block font-poppins text-sm font-medium text-gray-700"
                    >
                      Current Password
                    </label>
                    <PasswordField placeholder="Type current password" />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="mb-2 block font-poppins text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <PasswordField placeholder="Type new password" />
                  </div>
                  <div>
                    <label
                      htmlFor="location"
                      className="mb-2 block font-poppins text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <PasswordField placeholder="Type confirm password" />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <Button />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
