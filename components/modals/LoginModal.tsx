import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import logo from "@/assets/images/logo.svg";
import facebook from "@/assets/images/facebook.svg";
import google from "@/assets/images/google.svg";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Poppins } from "next/font/google";
// import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignUp: () => void;
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Including multiple weights
});

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onOpenSignUp,
}) => {
  const handleOpenChange = (open: boolean): void => {
    if (!open) {
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogClose className="absolute top-4 right-4 text-black" />
      <DialogContent className="bg-white w-[26rem] p-6 py-10 outline-0 border-none">
        <DialogHeader>
          <div className="flex justify-center mb-4 space-y-0">
            <Image
              className="-mb-4"
              src={logo}
              alt="Drive Vest Logo"
              height={40}
              width={40}
            />
          </div>
          <DialogTitle
            className={`${poppins.className} text-center text-2xl font-bold -mb-4`}
          >
            Log In
          </DialogTitle>
          <div className="flex space-x-4">
            <Button className="w-1/2 text-black border-black border-[1px] rounded-[5px] text-xs">
              <Image
                src={facebook}
                alt="facebook logo"
                height={15}
                width={15}
              />
              Continue with Facebook
            </Button>
            <Button className="w-1/2 text-black border-black border-[1px] rounded-[5px] text-xs">
              <Image src={google} alt="facebook logo" height={15} width={15} />
              Continue with Google
            </Button>
          </div>
          <div className="text-center flex my-4 text-sm font-semibold items-center justify-center space-x-2">
            <hr className="border-[0.4px] border-[#EAECF0] w-full" />
            <p className="text-[#9F9C9C] font-normal text-sm">OR</p>
            <hr className="border-[0.4px] border-[#EAECF0] w-full" />
          </div>
        </DialogHeader>
        <div className="space-y-1">
          <div className="flex space-x-4">
            <div>
              <Label className="text-xs font-normal text-[#0A0A0B]">
                Email*
              </Label>
              <Input
                type="text"
                placeholder="Enter your email address"
                className="w-full px-4 py-2 border border-[#EAECF0] rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
              />
            </div>
            <div>
              <Label className="text-xs font-normal text-[#0A0A0B]">
                Password*
              </Label>
              <Input
                type="text"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-[#EAECF0] rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center space-x-2">
              <Input type="checkbox" className="w-2 border-[#667085]" />
              <Label className="text-xs text-[#667085]">Remember me</Label>
            </div>
            <p className="text-xs text-[#667085]">
              Forgot password?
            </p>
          </div>
        </div>
        <DialogFooter>
          <div className="flex flex-col justify-center items-center w-full">
            <Button className="w-full bg-yellow-600 font-semibold text-base text-white bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)]">
              Log In
            </Button>
            <div className="text-center text-xs font-bold mt-4">
              Don&apos;t have an account?{" "}
              <span
                onClick={onOpenSignUp}
                className="font-bold text-[#E6B027] text-xs cursor-pointer border-none outline-none"
              >
                create one
              </span>
            </div>
            <p className="mt-6 text-xs">
              By continuing, you agree to the Terms of Service
              <br /> and acknowledge you’ve read our Privacy Policy.
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
