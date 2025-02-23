import { Poppins } from "next/font/google";
import Image from "next/image";
import React from "react";
import love from "@/assets/images/love.svg";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

interface PropertyCardProps {
  price: string;
  discount: string;
  title: string;
  location: string;
  bed: number;
  bath: number;
  image: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  price,
  discount,
  title,
  location,
  bed,
  bath,
  image,
}) => {
  return (
    <div
      className={`${poppins.className} bg-white rounded-lg shadow-lg overflow-hidden`}
    >
      <div className="rounded-[10px]">
        <Image
          src={image}
          alt={title}
          width={48}
          height={48}
          className="w-full h-48 object-cover p-4"
        />
      </div>
      <div className="p-4">
        {/* Price, Discount, and Love Image on the Same Line */}
        <div className="flex items-center justify-between gap-x-6">
          <div className="flex items-start gap-x-2">
            <p className="text-xs sm:text-sm font-semibold text-[#E6B027]">
              {price}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-[#9F9C9C] line-through">
              {discount}
            </p>
          </div>
          <Image src={love} width={20} height={20} alt="love" />
        </div>
        <h3 className="text-xs sm:text-sm font-medium text-gray-900 mt-2 mb-4">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600">
          {bed} Beds. {bath} Baths
        </p>
        <p className="text-xs sm:text-sm font-medium">{location}</p>
      </div>
    </div>
  );
};

export default PropertyCard;
