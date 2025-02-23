import logo from "@/assets/images/logo.svg";
import Image from "next/image";
import { Button } from "./ui/button";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

const Header = () => {
  return (
    <header className="bg-[linear-gradient(219.84deg,_#474747_4.14%,_#222222_44.22%)] text-white">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <div className="flex items-center space-x-2">
          <Image
            src={logo}
            alt="Drive vest logo"
            height={40}
            width={40}
            priority={true}
          />
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <Button
              className={`${poppins.className} m-2 py-5 px-8 bg-[#E6B027] rounded-[0.6rem] text-sm text-[#FAFAFA]`}
            >
              Register
            </Button>
            <Button
              className={`${poppins.className} m-2 y-5 px-8 rounded-[0.6rem] text-sm text-[#E6B027] border-[#E6B027] border`}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
