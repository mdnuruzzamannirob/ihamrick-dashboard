'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import Avatar from '@/assets/svg/Avatar.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { useGetCurrentUserQuery, useUpdateProfileMutation } from '../../../../services/allApi';
import 'react-toastify/dist/ReactToastify.css';

export default function ProfilePage() {
  const router = useRouter();

  // Initialize formData state with default values
  const [formData, setFormData] = useState({
    firstName: 'Hamrick',
    location: 'New York',
    email: 'hamrick@gmail.com',
    phoneNumber: '866 12 346 0780',
  });

  // Fetch current user data
  const { data: userData, isLoading, refetch } = useGetCurrentUserQuery();

  // Mutation hook to update profile
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (userData) {
      console.log('Current User Data: ', userData);
      setFormData({
        firstName: userData?.data?.userName,
        location: userData.data.location || 'New York', // Provide default if not available
        email: userData.data.email,
        phoneNumber: userData.data.phoneNumber || '866 12 346 0780', // Provide default if not available
      });
      setProfileImage(userData.data.profilePicture);
    }
  }, [userData]);

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

  const handleChangePassword = () => {
    router.push('/change-password');
  };
  const handleSaveChanges = async () => {
    const formDataToUpdate = new FormData();
    formDataToUpdate.append('userName', formData.firstName);
    formDataToUpdate.append('email', formData.email);
    formDataToUpdate.append('phoneNumber', formData.phoneNumber);
    formDataToUpdate.append('location', formData.location);

    if (profileImage) {
      formDataToUpdate.append('profilePicture', profileImage);
    }

    try {
      const response = await updateProfile(formDataToUpdate).unwrap();
      console.log(response);
      refetch();
      toast.success('Changes saved successfully!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirect to dashboard after success
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch {
      toast.error('Failed to save changes. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />
      <div className="min-h-screen flex-1 bg-gray-50 px-4 py-8 sm:px-6 lg:ml-64 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header with User Badge */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/dashboard"
              className="font-poppins flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
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
                  className="group relative cursor-pointer"
                  onClick={handleImageClick}
                  title="Click to upload profile image"
                >
                  <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-orange-100 transition-opacity group-hover:opacity-80 sm:h-20 sm:w-20">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        width={100}
                        height={100}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image src={Avatar} width={100} height={100} alt="Avatar" />
                    )}
                  </div>
                  <div className="absolute right-0 bottom-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#DD7372] bg-[#DD7372] sm:h-8 sm:w-8">
                    <Camera className="h-5 w-5 text-white sm:h-4 sm:w-4" />
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
                    {userData?.data?.userName || 'User Name'}
                  </h2>
                  <p className="font-poppins text-sm text-gray-500 sm:text-base">
                    {userData?.data?.email || 'Email not available'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                className="font-poppins flex flex-row items-center gap-x-1 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 sm:px-6 sm:py-2.5"
              >
                Change Password
                <ArrowRight className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Personal Information Form */}
            <div>
              <h3 className="font-poppins mb-6 text-lg font-semibold text-gray-900">
                Personal Information
              </h3>

              <div className="space-y-6">
                {/* First Row: First Name & Location */}
                <div className="grid gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="font-poppins mb-2 block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName} // Use formData for input
                      onChange={handleChange}
                      placeholder="Write your full name"
                      className="font-poppins w-full rounded-lg border border-gray-300 px-4 py-2.5 text-xs text-gray-900 transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="font-poppins mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email} // Use formData for input
                    onChange={handleChange}
                    placeholder="hamrick@gmail.com"
                    className="font-poppins w-full rounded-lg border border-gray-300 px-4 py-2.5 text-xs text-gray-900 transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="font-poppins mb-2 block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber} // Use formData for input
                    placeholder="+42"
                    onChange={handleChange}
                    className="font-poppins w-full rounded-lg border border-gray-300 px-4 py-2.5 text-xs text-gray-900 transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={isUpdating}
                  className="font-poppins flex items-center gap-2 rounded-md bg-black px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {isUpdating ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}
