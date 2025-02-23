"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-[linear-gradient(219.84deg,_#474747_4.14%,_#222222_44.22%)] text-white relative">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        {/* Hamburger menu (mobile only) */}
        <div className="sm:hidden">
          <button onClick={() => setIsMenuOpen((prev) => !prev)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {/* Centered on mobile, left-aligned on desktop */}
        <div className="flex flex-1 justify-center sm:justify-start">
          <Image
            src={logo}
            alt="Drive vest logo"
            height={40}
            width={40}
            priority={true}
          />
        </div>
        {/* Desktop menu: show buttons on larger screens */}
        <div className="hidden sm:flex items-center space-x-6">
          <Button
            className={`${poppins.className} py-5 px-8 bg-[#E6B027] rounded-[0.6rem] text-sm text-[#FAFAFA]`}
          >
            Register
          </Button>
          <Button
            className={`${poppins.className} py-5 px-8 rounded-[0.6rem] text-sm text-[#E6B027] border border-[#E6B027]`}
          >
            Login
          </Button>
        </div>
      </div>
      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 w-full bg-[#222222] py-4 flex flex-col items-center space-y-4">
          <Button
            className={`${poppins.className} w-3/4 py-2 bg-[#E6B027] rounded-[0.6rem] text-sm text-[#FAFAFA]`}
          >
            Register
          </Button>
          <Button
            className={`${poppins.className} w-3/4 py-2 rounded-[0.6rem] text-sm text-[#E6B027] border border-[#E6B027]`}
          >
            Login
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
