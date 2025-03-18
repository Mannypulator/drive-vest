"use client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { MapPin, Home, Tag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";

const PropertyFilters = () => {
  const categories = [
    "Apartment",
    "Condo",
    "House",
    "Cabin or Cottage",
    "Room",
    "Studio",
    "Other",
  ];

  const [category, setCategory] = useState<string>("Apartment");
  return (
    <section className="md:absolute border border-white shadow-sm outline-none bottom-0 top-[500px] left-0 md:left-20 container flex flex-col md:flex-row justify-center gap-8 px-4 md:px-8 pt-6 bg-white rounded-tl-[10px] rounded-tr-[10px] w-full md:w-[1280px] h-auto md:h-[120px] text-[#121212]">
      {/* Property Location */}
      <div className="relative w-full">
        <Label htmlFor="property-location" className="font-medium text-[14px]">
          Property Location
        </Label>
        <span className="absolute inset-y-0 left-4 bottom-2 flex items-center pointer-events-none text-[#E6B027]">
          <MapPin size={18} />
        </span>
        <Input
          className="w-full h-10 rounded-[5px] pl-10 border border-[#00000040] outline-none"
          type="search"
          id="property-location"
          name="property-location"
          placeholder="Sao Paulo, Sao Paulo, Brazil"
        />
      </div>
      <div className="relative w-full md:w-2/3">
        <Label htmlFor="property-type" className="font-medium text-[14px]">
          Property Type
        </Label>
        <span className="absolute inset-y-0 left-4 bottom-2 flex items-center pointer-events-none text-[#E6B027]">
          <Home size={18} />
        </span>
        <Select
          onValueChange={(value) => setCategory(value)}
          defaultValue={category}
        >
          <SelectTrigger className="w-full border rounded-[5px] pl-10">
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
      <div className="relative w-full md:w-2/3">
        <Label htmlFor="maximum-price" className="font-medium text-[14px]">
          Maximum Price
        </Label>
        <span className="absolute inset-y-0 left-4 bottom-2 flex items-center pointer-events-none text-[#E6B027]">
          <Tag size={18} />
        </span>
        <Input
          className="w-full h-10 rounded-[5px] pl-10 border border-[#00000040] outline-none"
          type="search"
          id="maximum-price"
          name="maximum-price"
          placeholder="NGN 5,000,000"
        />
      </div>
      <div>
        <Button className="w-full md:w-auto px-8 py-2 bg-[#E6B027] rounded-[5px] mt-4 md:mt-6 text-white border-0 outline-none">
          Search
        </Button>
      </div>
    </section>
  );
};

export default PropertyFilters;
