"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "./modal-context";
import Image from "next/image";
import { Button } from "./ui/button";
import { Poppins } from "next/font/google";
import { Label } from "./ui/label";
import logo from "@/assets/images/logo.svg";
import facebook from "@/assets/images/facebook.svg";
import google from "@/assets/images/google.svg";
import { Input } from "./ui/input";
import email from "@/assets/images/email.svg";
import { useActionState, useEffect, useState } from "react";
import { Country, ICountry, IState, State } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { signIn } from "next-auth/react";
import { signInDefaultValues } from "@/lib/constants";
import { signInWithCredentials, signUpUser } from "@/lib/actions/user.actions";
import { useFormStatus } from "react-dom";
import { addProperty } from "@/lib/actions/property.actions";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Including multiple weights
});

export function Modals() {
  const { activeModal, closeModal, openModal } = useModal();
  const [signInData, signInAction] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  const [signUpData, signUpAction] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  const [addPropertyData, addPropertyAction] = useActionState(addProperty, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (addPropertyData.success) {
      setListingTitle("");
      setCategory("Apartment");
      setCountry("");
      setState("");
      setCurrency("NGN");
      setActualPrice("");
      setDiscountPrice("");
      setDescription("");
      setSelectedImages([]);
      setVideoPreview(null);
      setVideoError(null);
      setSelectedAmenities([]);

      // Close the modal
      closeModal();
    }
  }, [addPropertyData.success, closeModal]);

  const { pending } = useFormStatus();
  const amenities: string[] = [
    "wifi",
    "Free Parking",
    "24/7 Security",
    "Dishwasher",
    "Balcony/Patio",
    "Full kitchen",
    "Washer & Dryer",
    "Swimming Pool",
    "Wheelchair Accessible",
    "Gym/Fitness Center",
    "Smart TV",
    "Coffee Maker",
    "Air Conditioning",
    "Elevator Access",
    "Hot Tub",
  ];

  const categories = [
    "Apartment",
    "Condo",
    "House",
    "Cabin or Cottage",
    "Room",
    "Studio",
    "Other",
  ];

  const currencies = ["NGN", "USD", "EUR", "GBP", "CAD"];

  const [listingTitle, setListingTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("Apartment");
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [currency, setCurrency] = useState("NGN");
  const [actualPrice, setActualPrice] = useState<string>("");
  const [discountPrice, setDiscountPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] =
    useState<string[]>(amenities);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    const selectedCountry = countries.find((c) => c.name === country);
    if (selectedCountry) {
      const statesOfCountry = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(statesOfCountry);
    } else {
      setStates([]);
    }
  }, [country, countries]);

  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Handle Image Upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  // Toggle Amenities
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (limit: 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setVideoError("Video file must be less than 10MB.");
      return;
    }

    // Validate file format
    const validFormats = ["video/mp4", "video/mov", "video/avi", "video/mkv"];
    if (!validFormats.includes(file.type)) {
      setVideoError("Invalid format. Allowed formats: MP4, MOV, AVI, MKV.");
      return;
    }

    setVideoError(null);
    const videoURL = URL.createObjectURL(file);
    setVideoPreview(videoURL);
  };

  const removeVideo = () => {
    setVideoPreview(null);
  };

  const formatNumber = (value: string): string => {
    const number = parseFloat(value.replace(/,/g, ""));
    if (isNaN(number)) return "";
    return new Intl.NumberFormat().format(number);
  };

  const handleActualPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(rawValue)) {
      setActualPrice(formatNumber(rawValue));
    }
  };

  const handleDiscountPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(rawValue)) {
      setDiscountPrice(formatNumber(rawValue));
    }
  };

  return (
    <>
      <Dialog open={activeModal === "login"} onOpenChange={closeModal}>
        <DialogContent className="bg-white w-[26rem] p-6 py-10 outline-0 border-none">
          <form action={signInAction}>
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
                <Button
                  onClick={() => signIn("facebook")}
                  className="w-1/2 text-black border-black border-[1px] rounded-[5px] text-xs"
                >
                  <Image
                    src={facebook}
                    alt="facebook logo"
                    height={15}
                    width={15}
                  />
                  Continue with Facebook
                </Button>
                <Button
                  onClick={() => signIn("google")}
                  className="w-1/2 text-black border-black border-[1px] rounded-[5px] text-xs"
                >
                  <Image
                    src={google}
                    alt="facebook logo"
                    height={15}
                    width={15}
                  />
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
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                    defaultValue={signInDefaultValues.email}
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
                    id="password"
                    name="password"
                    required
                    autoComplete="password"
                    defaultValue={signInDefaultValues.password}
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
                <p
                  onClick={() => openModal("forgot-password")}
                  className="text-xs text-[#667085] cursor-pointer"
                >
                  Forgot password?
                </p>
              </div>
            </div>
            <DialogFooter>
              <div className="flex flex-col justify-center items-center w-full">
                <Button
                  disabled={pending}
                  className="w-full bg-yellow-600 font-semibold text-base text-white bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)]"
                >
                  {pending ? "Loging In..." : "Log In"}
                </Button>
                {signInData && !signInData.success && (
                  <div className="text-center text-destructive">
                    {signInData.message}
                  </div>
                )}
                <div className="text-center text-xs font-bold mt-4">
                  Don&apos;t have an account?{" "}
                  <span
                    onClick={() => openModal("signup")}
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
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={activeModal === "signup"} onOpenChange={closeModal}>
        <DialogContent className="bg-white w-[26rem] p-6 py-10 outline-0 border-none">
          <form action={signUpAction}>
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
                <Button
                  onClick={() => signIn("facebook")}
                  className="w-1/2 text-black border-black border-[1px] rounded-[5px] text-xs"
                >
                  <Image
                    src={facebook}
                    alt="facebook logo"
                    height={15}
                    width={15}
                    priority={true}
                  />
                  Sign up with Facebook
                </Button>
                <Button
                  onClick={() => signIn("google")}
                  className="w-1/2 text-black border-black border-[1px] rounded-[5px] text-xs"
                >
                  <Image
                    src={google}
                    alt="facebook logo"
                    height={15}
                    width={15}
                  />
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
                    id="firstName"
                    name="firstName"
                    autoComplete="firstName"
                    required
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
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="lastName"
                    required
                    placeholder="Enter your last name"
                    className="w-full px-4 py-2 border border-[#EAECF0] rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-normal text-[#0A0A0B]">
                  Email*
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2 border border-[#EAECF0] rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
                />
              </div>
              <div>
                <Label className="text-xs font-normal text-[#0A0A0B]">
                  Phone Number*
                </Label>
                <Input
                  type="phone"
                  id="phoneNumber"
                  name="phoneNumber"
                  autoComplete="phoneNumber"
                  required
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 border border-[#EAECF0] rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
                />
              </div>
              <div className="-mt-4">
                <Label className="text-xs font-normal text-[#0A0A0B]">
                  Password*
                </Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="password"
                  required
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
                  disabled={pending}
                  className="w-full font-semibold text-base text-white bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)]"
                >
                  {pending ? "Signing Up..." : "Sign Up"}
                </Button>
                {signUpData && !signUpData.success && (
                  <div className="text-center text-destructive">
                    {signUpData.message}
                  </div>
                )}
                <div className="text-center text-xs font-bold mt-4">
                  Already have an account?{" "}
                  <span
                    onClick={() => openModal("login")}
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
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={activeModal === "forgot-password"}
        onOpenChange={closeModal}
      >
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
            <DialogTitle className="text-center text-2xl font-bold -mb-4">
              Forgot Password
            </DialogTitle>
          </DialogHeader>
          <div>
            <Label className="text-xs font-normal text-[#0A0A0B]">Email*</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-[#EAECF0] rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
            />
          </div>
          <div>
            <Button
              onClick={() => openModal("reset-password")}
              className="w-full bg-yellow-600 font-semibold text-base text-white bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)]"
            >
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={activeModal === "reset-password"} onOpenChange={closeModal}>
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
            <DialogTitle className="text-center text-2xl font-bold -mb-4">
              Reset Password
            </DialogTitle>
          </DialogHeader>
          <div>
            <Label className="text-xs font-normal text-[#0A0A0B]">
              Enter new password*
            </Label>
            <Input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-[#EAECF0] rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
            />
          </div>
          <div>
            <Label className="text-xs font-normal text-[#0A0A0B]">
              Confirm password*
            </Label>
            <Input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-[#EAECF0] rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
            />
          </div>
          <div>
            <Button
              onClick={() => openModal("success")}
              className="w-full bg-yellow-600 font-semibold text-base text-white bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)]"
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "success"} onOpenChange={closeModal}>
        <DialogContent className="bg-white md:w-[5rem] lg:w-[26rem] p-6 py-10 outline-0 border-none">
          <DialogHeader>
            <Image
              className="mx-auto"
              src={email}
              alt="email"
              height={66}
              width={67}
            />
          </DialogHeader>
          <DialogTitle className="text-center sm: text-sm lg:text-2xl font-bold lg:mb-4">
            Email sent, Check your inbox!
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-gray-500">
            Should the email address you provided be registered with a Distress
            Sale account, you will receive a link to reset your password.
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <Dialog open={activeModal === "add-post"} onOpenChange={closeModal}>
        <DialogContent className="bg-white lg:w-full lg:max-w-xl max-h-[90vh] overflow-y-auto p-6 lg:rounded-[8px] lg:shadow-lg outline-none border-none">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              New Post
            </DialogTitle>
          </DialogHeader>

          {/* Form */}
          <form
            action={addPropertyAction}
            className={`${poppins.className} mt-4 space-y-4`}
          >
            {/* Listing Title */}
            <div>
              <Label>Listing Name</Label>
              <Input
                type="text"
                id="listingTitle"
                name="listingTitle"
                placeholder="Write a descriptive title"
                className="w-full rounded-[5px] placeholder:text-[#C4C4C4] placeholder:text-xs"
                value={listingTitle}
                onChange={(e) => setListingTitle(e.target.value)}
                required
              />
            </div>

            {/* Dropdowns */}
            <div>
              <Label>Select Category</Label>
              <Select
                name="category"
                onValueChange={(value) => setCategory(value)}
                defaultValue={category}
              >
                <SelectTrigger className="w-full border rounded-[5px]">
                  <SelectValue placeholder="Apartment" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-[5px]">
                  {categories.map((cat) => (
                    <SelectItem className="bg-white" key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Country Input Field */}
            <div>
              <Label>Country</Label>
              <Select
                name="country"
                onValueChange={(val: string) => setCountry(val)}
                value={country}
              >
                <SelectTrigger className="w-full border rounded-[5px]">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-[5px] max-h-64 overflow-y-auto">
                  {countries.map((c) => (
                    <SelectItem key={c.isoCode} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* State/Province */}
            <div>
              <Label>State</Label>
              <Select
                name="state"
                onValueChange={(val: string) => setState(val)}
                value={state}
                disabled={!states.length}
              >
                <SelectTrigger className="w-full border rounded-[5px]">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-[5px] max-h-64 overflow-y-auto">
                  {states.map((s) => (
                    <SelectItem key={s.isoCode} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prices & Currency */}
            <div className="grid grid-cols-10 gap-4">
              {/* Currency Dropdown */}
              <div className="col-span-2">
                <br />
                <Select
                  name="currency"
                  onValueChange={(value) => setCurrency(value)}
                  defaultValue={currency}
                >
                  <SelectTrigger className="border rounded-[5px]">
                    <SelectValue placeholder="NGN" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {currencies.map((cur) => (
                      <SelectItem className="bg-white" key={cur} value={cur}>
                        {cur}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Actual Price */}
              <div className="col-span-4">
                <Label className={`${poppins.className}`}>Actual Price</Label>
                <Input
                  name="actualPrice"
                  className="placeholder:text-[#C4C4C4] placeholder:text-xs rounded-[5px]"
                  type="text"
                  placeholder="Enter price"
                  value={actualPrice}
                  onChange={handleActualPriceChange}
                  required
                />
              </div>

              {/* Discount Price */}
              <div className="col-span-4">
                <Label>Discount Price</Label>
                <Input
                  name="discountPrice"
                  className="placeholder:text-[#C4C4C4] placeholder:text-xs rounded-[5px]"
                  type="text"
                  placeholder="Enter discount price"
                  value={discountPrice}
                  onChange={handleDiscountPriceChange}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <textarea
                name="description"
                placeholder="Type a detailed description of the listing"
                className="w-full border p-2 h-24 placeholder:text-[#C4C4C4] placeholder:text-xs rounded-[5px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Upload Photos */}
            <div>
              <Label>Upload Photos</Label>
              <div className="flex gap-3 mt-2 flex-wrap">
                <label className="w-20 h-20 bg-[#F8E8BF] flex items-center justify-center cursor-pointer border-none outline-none rounded-[15px]">
                  +
                  <input
                    name="images"
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative w-20 h-20 max-h-20">
                    <Image
                      src={image}
                      alt="Uploaded"
                      className="w-full h-full object-cover rounded-[15px]"
                      width={400}
                      height={400}
                    />
                    <button
                      className="absolute top-0 right-0 bg-white border border-[#B6B6B6] text-black rounded-full w-4 h-4 text-xs flex items-center justify-center"
                      onClick={() =>
                        setSelectedImages((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Upload Video</Label>
              <div className="flex gap-3 mt-2 flex-wrap">
                <label className="w-20 h-20 bg-[#F8E8BF] flex items-center justify-center cursor-pointer border-none outline-none rounded-[15px]">
                  +
                  <input
                    name="video"
                    type="file"
                    className="hidden"
                    accept="video/mp4, video/mov, video/avi, video/mkv"
                    onChange={handleVideoUpload}
                  />
                </label>

                {videoPreview && (
                  <div className="relative w-40 h-24">
                    <video className="w-full h-full rounded-[15px]" controls>
                      <source src={videoPreview} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <button
                      className="absolute top-0 right-0 bg-white border border-[#B6B6B6] text-black rounded-full w-4 h-4 text-xs flex items-center justify-center"
                      onClick={removeVideo}
                    >
                      ✖
                    </button>
                  </div>
                )}
              </div>

              {videoError && (
                <p className="text-red-500 text-xs mt-2">{videoError}</p>
              )}
            </div>

            {/* Amenities */}

            <div>
              <Label className="font-medium text-gray-700">Amenities:</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2.5">
                    <Checkbox
                      id={amenity}
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                      className="w-6 h-6 p-1 border border-[#E3E3E3] rounded-[3px] shadow-lg shadow-black/25"
                    />
                    <Label
                      htmlFor={amenity}
                      className="text-gray-600 text-sm cursor-pointer"
                    >
                      {amenity}
                    </Label>

                    {/* 🔹 Hidden input that is conditionally rendered if checked */}
                    {selectedAmenities.includes(amenity) && (
                      <input type="hidden" name="amenities" value={amenity} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <DialogFooter>
              <Button
                disabled={pending}
                className="w-full bg-[#E6B027] text-white rounded-[5px]"
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
