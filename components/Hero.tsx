import check from "@/assets/images/check.svg";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="relative pt-10 pb-32 bg-[url('/hero.svg')] flex flex-col">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs"></div>
      <div className="relative z-10 container mx-auto px-4">
        <p className="mb-4 text-white flex flex-col space-y-4">
          <span className="text-7xl font-extrabold">Find Your Perfect</span>
          <span className="text-7xl font-extrabold">Future Home</span>
        </p>
        <p className="text-gray-300 text-lg mb-6 flex items-center gap-2">
          <Image
            src={check}
            height={22}
            width={22}
            priority={true}
            alt="check image"
          />
          Reliable, Secured, On Time. Let us handle the property choices.
        </p>
        <button className="bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)]  text-white px-12 py-4 rounded hover:bg-gray-800 text-base">
          Discover more properties
        </button>
      </div>
    </div>
  );
};

export default Hero;
