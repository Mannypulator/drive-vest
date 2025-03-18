import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
}) => {
  const handleOpenChange = (open: boolean): void => {
    if (!open) {
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
            Create a new account
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-gray-500">
            Full access to in any of our products
          </DialogDescription>
          <div className="flex space-x-4">
            <Button className="w-1/2 text-black border-black border-[1px] rounded-[5px] text-xs">
              <Image
                src={facebook}
                alt="facebook logo"
                height={15}
                width={15}
                priority={true}
              />
              Sign up with Facebook
            </Button>
            <Button className="w-1/2 text-black border-black border-[1px] rounded-[5px] text-xs">
              <Image src={google} alt="facebook logo" height={15} width={15} />
              Sign up with Google
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
                First Name*
              </Label>
              <Input
                type="text"
                placeholder="Enter your first name"
                className="w-full px-4 py-2 border border-[#EAECF0] rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
              />
            </div>
            <div>
              <Label className="text-xs font-normal text-[#0A0A0B]">
                Last Name*
              </Label>
              <Input
                type="text"
                placeholder="Enter your last name"
                className="w-full px-4 py-2 border border-[#EAECF0] rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs font-normal text-[#0A0A0B]">Email*</Label>
            <Input
              type="text"
              placeholder="Enter your email address"
              className="w-full px-4 py-2 border border-[#EAECF0] rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
            />
          </div>
          <div>
            <Label className="text-xs font-normal text-[#0A0A0B]">
              Phone Number*
            </Label>
            <Input
              type="text"
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border border-[#EAECF0] rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
            />
          </div>
          <div className="-mt-4">
            <Label className="text-xs font-normal text-[#0A0A0B]">
              Password*
            </Label>
            <Input
              type="text"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-[#EAECF0] rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal -mt-2"
            />
          </div>
          <p className={`${poppins.className} text-xs text-gray-500`}>
            Password must have minimum 7 Characters
          </p>
        </div>
        <DialogFooter>
          <div className="flex flex-col justify-center items-center w-full">
            <Button
              onClick={() => (isOpen = false)}
              className="w-full bg-yellow-600 font-semibold text-base text-white bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)]"
            >
              Sign Up
            </Button>
            <div className="text-center text-xs font-bold mt-4">
              Already have an account?{" "}
              <span
                onClick={onOpenLogin}
                className="font-bold text-[#E6B027] text-xs cursor-pointer"
              >
                Log In
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

export default SignUpModal;
