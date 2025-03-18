"use client";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import { Bell, Clock } from "lucide-react";
import defaultProfile from "@/assets/images/default-profile.svg"; // Replace with actual user profile image
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useModal } from "./modal-context";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.actions";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

const LoginHeader = () => {
  const { openModal } = useModal();
  const { data: session } = useSession();

  console.log(session);
  return (
    <header
      className={`${poppins.className} bg-[linear-gradient(219.84deg,_#474747_4.14%,_#222222_44.22%)] text-white py-4 px-24 flex justify-between items-center`}
    >
      <div className="flex items-center">
        {/* add link to image to go home page */}
        <Link href="/">
          <Image
            src={logo}
            alt="Drive Vest Logo"
            height={40}
            width={40}
            className="rounded-full"
          />
        </Link>
      </div>
      <div className="flex items-center space-x-6">
        <div className="relative">
          <Clock size={24} />
          <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
            12
          </span>
        </div>
        <div className="relative">
          <Bell size={24} />
          <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
            12
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="border-none bg-white outline-none rounded-full">
            <div className="flex items-center space-x-2 bg-white rounded-full p-2">
              <Image
                src={session?.user?.image || defaultProfile}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-black">{session?.user?.name ?? ""}</span>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 18 18"
                  stroke="currentColor"
                  className="text-yellow-500"
                >
                  <path
                    d="M14 7l-5 5-5-5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white rounded-[5px] outline-none border-none">
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => signOutUser()}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Right button */}
        <button
          className=" bg-[#E6B027] text-white py-2 px-6 rounded-[5px]"
          onClick={() => openModal("add-post")}
        >
          + Post
        </button>
      </div>
    </header>
  );
};

export default LoginHeader;
