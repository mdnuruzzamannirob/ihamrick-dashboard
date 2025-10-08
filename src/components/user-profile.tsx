import { User } from "lucide-react";
import Image from "next/image";
import Avatar from "@/assets/svg/Avatar.svg";
export function UserProfile() {
  return (
    <div className="flex w-[163px] h-[48px] items-center gap-2 rounded-lg border border-black bg-white px-3 py-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-full ">
        <Image src={Avatar} width={28} height={28} alt="Avatar" />
      </div>
      <div className="flex flex-col">
        <span className="font-poppins font-medium text-[10px] text-black">
          Admin
        </span>
        <span className="text-base font-poppins font-medium text-black">
          Hormick
        </span>
      </div>
    </div>
  );
}
