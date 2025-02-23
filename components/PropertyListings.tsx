import React from "react";
import PropertyCard from "./PropertyCard";
import property1 from "@/assets/images/property1.svg";
import property2 from "@/assets/images/property2.svg";
import property3 from "@/assets/images/property3.svg";
import property4 from "@/assets/images/property4.svg";
import { Poppins } from "next/font/google";
import { ChevronRight } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

const PropertyListings = () => {
  const properties = [
    {
      id: 1,
      price: "NGN 22,000,000.00",
      discount: "250,000.00",
      title: "Fully Furnished Apartment + Pool with a wide compound",
      location: "Shams Abu Dhabi, Al Reem Island",
      bed: 4,
      bath: 5,
      image: property1,
    },
    {
      id: 2,
      price: "NGN 22,000,000.00",
      discount: "250,000.00",
      title: "Fully Furnished Apartment + Pool with a wide compound",
      location: "Shams Abu Dhabi, Al Reem Island",
      bed: 4,
      bath: 5,
      image: property2,
    },
    {
      id: 3,
      price: "NGN 22,000,000.00",
      discount: "250,000.00",
      title: "Fully Furnished Apartment + Pool with a wide compound",
      location: "Shams Abu Dhabi, Al Reem Island",
      bed: 4,
      bath: 5,
      image: property3,
    },
    {
      id: 4,
      price: "NGN 22,000,000.00",
      discount: "250,000.00",
      title: "Fully Furnished Apartment + Pool with a wide compound",
      location: "Shams Abu Dhabi, Al Reem Island",
      bed: 4,
      bath: 5,
      image: property4,
    },
  ];

  return (
    <section className="container mx-auto max-w-screen-xl px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2
          className={`${poppins.className} text-2xl md:text-[28px] font-extrabold text-[#E6B027] mb-4 md:mb-0`}
        >
          Property for Sale
        </h2>
        <button className="text-[#E6B027] font-medium flex text-base md:text-[20px] items-center">
          See all <ChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            price={property.price}
            discount={property.discount}
            title={property.title}
            bed={property.bed}
            bath={property.bath}
            location={property.location}
            image={property.image}
          />
        ))}
      </div>
    </section>
  );
};

export default PropertyListings;
