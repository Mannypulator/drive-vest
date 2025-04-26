"use client";
import { Input } from "@/components/ui/input";
import { SelectTrigger } from "@radix-ui/react-select";
import { SelectContent, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import { Select } from "@/components/ui/select";
import { Poppins } from "next/font/google";
import { Country, IState, State } from "country-state-city";
import { ICountry } from "country-state-city";
import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Property } from "@/types";
import { editPropertyById } from "@/lib/actions/property.actions";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
const EditProductForm = ({ property }: { property: Property }) => {
  const currencies = ["NGN", "USD", "EUR", "GBP", "CAD"];

  const [category, setCategory] = useState<string>(
    property?.type ?? "Apartment"
  );
  const [type, setType] = useState<string>(property?.type ?? "For Sale");
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [country, setCountry] = useState<string>("Nigeria");
  const [state, setState] = useState<string>("Lagos");
  const [currency, setCurrency] = useState("NGN");
  const [actualPrice, setActualPrice] = useState<string>(
    property?.price?.toString() ?? ""
  );
  const [discountPrice, setDiscountPrice] = useState<string>(
    property?.discount?.toString() ?? ""
  );
  const [description, setDescription] = useState<string>(
    property?.description ?? ""
  );
  const [selectedImages, setSelectedImages] = useState<string[]>(
    property?.images ?? []
  );
  const [videoPreview, setVideoPreview] = useState<string | null>(
    property?.videoUrl ?? null
  );
  const [videoError, setVideoError] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    property?.amenities ?? []
  );

  // Update state when property changes
  useEffect(() => {
    setCategory(property?.type ?? "Apartment");
    setType(property?.type ?? "For Sale");
    setActualPrice(property?.price?.toString() ?? "");
    setDiscountPrice(property?.discount?.toString() ?? "");
    setDescription(property?.description ?? "");
    setSelectedImages(property?.images ?? []);
    setVideoPreview(property?.videoUrl ?? null);
    setSelectedAmenities(property?.amenities ?? []);
  }, [property]);

  // Handle form submission
  const handleSubmit = async (formData: FormData) => {
    const result = await editPropertyById(property.id, formData);
    if (result.success) {
      // Update local state with new values
      setCategory(formData.get("category") as string);
      setType(formData.get("type") as string);
      setActualPrice(formData.get("actualPrice") as string);
      setDiscountPrice(formData.get("discountPrice") as string);
      setDescription(formData.get("description") as string);
      setSelectedAmenities(formData.getAll("amenities") as string[]);
    }
  };

  const [editPropertyData, editPropertyAction] = useActionState(
    async (state: void, formData: FormData) => {
      return await handleSubmit(formData);
    },
    { success: false, message: "" }
  );

  console.log(property);

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

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (limit: 10MB)
    if (file.size > 50 * 1024 * 1024) {
      setVideoError("Video file must be less than 50MB.");
      return;
    }

    // Validate file format
    const validFormats = [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
      "video/H265",
      "video/hevc",
    ];
    if (!validFormats.includes(file.type)) {
      setVideoError("Invalid format. Allowed formats: MP4, MOV, AVI, MKV.");
      return;
    }

    setVideoPreview(URL.createObjectURL(file));
    setVideoError(null);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  return (
    <form
      action={editPropertyAction}
      className={`${poppins.className} mt-4 space-y-4`}
    >
      <div>
        <Label>Listing Name</Label>
        <Input
          type="text"
          id="listingTitle"
          name="listingTitle"
          placeholder="Write a descriptive title"
          className="w-full rounded-[5px] placeholder:text-[#C4C4C4] placeholder:text-xs"
          defaultValue={property?.name ?? ""}
          required
        />
      </div>

      {/* add a select for user to pick for sale or for rent */}
      <div>
        <Label>Select Type</Label>
        <Select
          name="type"
          value={type}
          onValueChange={(value) => setType(value)}
        >
          <SelectTrigger className="w-full border rounded-[5px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-white rounded-[5px]">
            <SelectItem value="For Sale">For Sale</SelectItem>
            <SelectItem value="For Rent">For Rent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Dropdowns */}
      <div>
        <Label>Select Category</Label>
        <Select
          name="category"
          onValueChange={(value) => setCategory(value)}
          defaultValue={property?.type ?? "Apartment"}
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
          value="Nigeria"
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
          value={property?.location?.state ?? "Lagos"}
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
            defaultValue={property?.price ?? ""}
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
            defaultValue={property?.discount ?? ""}
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
          defaultValue={property?.description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
      </div>
      <div className="mb-4 flex flex-wrap">
        <div className="w-full sm:w-1/3 pr-2">
          <Label htmlFor="beds" className="block text-gray-700 font-bold mb-2">
            Beds
          </Label>
          <Input
            type="number"
            id="beds"
            name="beds"
            className="border rounded w-full py-2 px-3"
            required
            defaultValue={property?.beds ?? ""}
          />
        </div>
        <div className="w-full sm:w-1/3 px-2">
          <Label htmlFor="baths" className="block text-gray-700 font-bold mb-2">
            Baths
          </Label>
          <Input
            type="number"
            id="baths"
            name="baths"
            className="border rounded w-full py-2 px-3"
            required
            defaultValue={property?.baths ?? ""}
          />
        </div>
        <div className="w-full sm:w-1/3 pl-2">
          <Label
            htmlFor="square_feet"
            className="block text-gray-700 font-bold mb-2"
          >
            Square Feet
          </Label>
          <Input
            type="number"
            id="square_feet"
            name="square_feet"
            className="border rounded w-full py-2 px-3"
            required
            defaultValue={property?.squareFeet ?? ""}
          />
        </div>
      </div>

      {type === "For Rent" && (
        <div className="mb-4 bg-blue-50 p-4">
          <Label className="block text-gray-700 font-bold mb-2">Rates</Label>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex items-center">
              <Label htmlFor="weekly_rate" className="mr-2">
                Weekly
              </Label>
              <Input
                type="number"
                id="weekly_rate"
                name="rates.weekly"
                className="border rounded w-full py-2 px-3"
                defaultValue={property?.rates?.weekly?.toString() ?? ""}
              />
            </div>
            <div className="flex items-center">
              <Label htmlFor="monthly_rate" className="mr-2">
                Monthly
              </Label>
              <Input
                type="number"
                id="monthly_rate"
                name="rates.monthly"
                className="border rounded w-full py-2 px-3"
                defaultValue={property?.rates?.monthly?.toString() ?? ""}
              />
            </div>
            <div className="flex items-center">
              <Label htmlFor="nightly_rate" className="mr-2">
                Nightly
              </Label>
              <Input
                type="number"
                id="nightly_rate"
                name="rates.nightly"
                className="border rounded w-full py-2 px-3"
                defaultValue={property?.rates?.nightly?.toString() ?? ""}
              />
            </div>
          </div>
        </div>
      )}
      <div className="mb-4">
        <Label
          htmlFor="seller_name"
          className="block text-gray-700 font-bold mb-2"
        >
          Seller Name
        </Label>
        <Input
          type="text"
          id="seller_name"
          name="seller_info.name."
          className="border rounded w-full py-2 px-3"
          placeholder="Name"
          defaultValue={property?.sellerInfo?.name ?? ""}
        />
      </div>
      <div className="mb-4">
        <Label
          htmlFor="seller_email"
          className="block text-gray-700 font-bold mb-2"
        >
          Seller Email
        </Label>
        <Input
          type="email"
          id="seller_email"
          name="seller_info.email"
          className="border rounded w-full py-2 px-3"
          placeholder="Email address"
          required
          defaultValue={property?.sellerInfo?.email ?? ""}
        />
      </div>
      <div className="mb-4">
        <Label
          htmlFor="seller_phone"
          className="block text-gray-700 font-bold mb-2"
        >
          Seller Phone
        </Label>
        <Input
          type="tel"
          id="seller_phone"
          name="seller_info.phone"
          className="border rounded w-full py-2 px-3"
          placeholder="Phone"
          defaultValue={property?.sellerInfo?.phone ?? ""}
        />
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
          {property?.images?.map((image, index) => (
            <div
              key={`property-image-${index}`}
              className="relative w-20 h-20 max-h-20"
            >
              <Image
                src={image}
                alt="Uploaded"
                className="w-full h-full object-cover rounded-[15px]"
                width={400}
                height={400}
              />
              <Button
                className="absolute top-0 right-0 bg-white border border-[#B6B6B6] text-black rounded-full w-4 h-4 text-xs flex items-center justify-center"
                onClick={() =>
                  setSelectedImages((prev) =>
                    prev.filter((_, i) => i !== index)
                  )
                }
              >
                ✖
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label>Upload Video</Label>
        <div className="flex gap-3 mt-2 flex-wrap">
          <Label className="w-20 h-20 bg-[#F8E8BF] flex items-center justify-center cursor-pointer border-none outline-none rounded-[15px]">
            +
            <Input
              name="video"
              type="file"
              className="hidden"
              accept="video/mp4, video/mov, video/avi, video/mkv"
              onChange={handleVideoUpload}
            />
          </Label>

          {videoPreview && (
            <div className="relative w-40 h-24">
              <video className="w-full h-full rounded-[15px]" controls>
                <source src={property?.videoUrl ?? ""} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <Button
                className="absolute top-0 right-0 bg-white border border-[#B6B6B6] text-black rounded-full w-4 h-4 text-xs flex items-center justify-center"
                onClick={removeVideo}
              >
                ✖
              </Button>
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
          {amenities.map((amenity, index) => (
            <div
              key={`property-amenity-${index}`}
              className="flex items-center gap-2.5"
            >
              <Checkbox
                id={`property-amenity-${index}`}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
                className="w-6 h-6 p-1 border border-[#E3E3E3] rounded-[3px] shadow-lg shadow-black/25"
              />
              <Label
                htmlFor={`property-amenity-${index}`}
                className="text-gray-600 text-sm cursor-pointer"
              >
                {amenity}
              </Label>
              {selectedAmenities.includes(amenity) && (
                <input type="hidden" name="amenities" value={amenity} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button className="w-full bg-[#E6B027] text-white rounded-[5px]">
        Submit
      </Button>
    </form>
  );
};

export default EditProductForm;
