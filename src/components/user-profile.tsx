import Image from "next/image";
import Avatar from "@/assets/svg/Avatar.svg";
import { useGetCurrentUserQuery } from "../../services/allApi";
import { useEffect } from "react";

export function UserProfile() {
  // Fetch current user data
  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCurrentUserQuery();

  useEffect(() => {
    refetch();
  }, [userData]);
  // Log the user data to the console when available
  if (userData) {
    console.log(userData);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex w-[163px] `h-[48px]` items-center gap-2 rounded-lg border border-black bg-white px-3 py-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-full">
        <Image src={Avatar} width={28} height={28} alt="Avatar" />
      </div>
      <div className="flex flex-col">
        <span className="font-poppins font-medium text-[10px] text-black">
          {userData?.data?.role || "Admin"}{" "}
          {/* You can adjust this based on your role */}
        </span>
        <span className="text-base font-poppins font-medium text-black">
          {userData?.data?.userName || "Hormick"}{" "}
          {/* Default to "Hormick" if no userName */}
        </span>
      </div>
    </div>
  );
}
