"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "./modal-context";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import Image from "next/image";

export function AddPostModal() {

  const { activeModal, closeModal } = useModal();

  // State for form fields
  const [listingTitle, setListingTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [actualPrice, setActualPrice] = useState<string>("");
  const [discountPrice, setDiscountPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "Free Shipping & Fast Delivery",
    "24/7 Security",
    "Free 1 Year Warranty",
  ]);

  const amenities: string[] = [
    "Free Shipping & Fast Delivery",
    "Swimming Pool",
    "Free 1 Year Warranty",
    "24/7 Security",
    "Beach View",
  ];

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

  // Handle Form Submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = {
      listingTitle,
      category,
      country,
      state,
      actualPrice,
      discountPrice,
      description,
      selectedImages,
      selectedAmenities,
    };
    console.log("Form Data Submitted:", formData);
    closeModal();
  };

  return (
    <Dialog open={activeModal === "add-post"} onOpenChange={closeModal}>
      <DialogContent className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            New Post
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          {/* Listing Title */}
          <div>
            <Label>Listing Title:</Label>
            <Input
              type="text"
              placeholder="Write a descriptive title"
              className="w-full"
              value={listingTitle}
              onChange={(e) => setListingTitle(e.target.value)}
              required
            />
          </div>

          {/* Dropdowns */}
          {[
            { label: "Select Category", state: category, setter: setCategory },
            { label: "Select Country", state: country, setter: setCountry },
            { label: "Select State/Province", state: state, setter: setState },
          ].map(({ label, state, setter }) => (
            <div key={label}>
              <Label>{label}:</Label>
              <select
                className="w-full border border-gray-300 p-2 rounded-md"
                value={state}
                onChange={(e) => setter(e.target.value)}
                required
              >
                <option value="">Select an option</option>
              </select>
            </div>
          ))}
          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Actual Price",
                value: actualPrice,
                setter: setActualPrice,
              },
              {
                label: "Discount Price",
                value: discountPrice,
                setter: setDiscountPrice,
              },
            ].map(({ label, value, setter }) => (
              <div key={label}>
                <Label>{label}:</Label>
                <div className="flex border border-gray-300 rounded-md p-2">
                  <span className="mr-2">NGN</span>
                  <Input
                    type="number"
                    className="w-full outline-none"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <Label>Description:</Label>
            <textarea
              placeholder="Type a detailed description of the listing"
              className="w-full border border-gray-300 p-2 rounded-md h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Upload Photos */}
          <div>
            <Label>Upload Photos:</Label>
            <div className="flex gap-3 mt-2">
              <label className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-md cursor-pointer border border-dashed border-gray-400">
                +
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
              {selectedImages.map((image, index) => (
                <div key={index} className="relative w-20 h-20">
                  <Image
                    src={image}
                    alt="Uploaded"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
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

          {/* Amenities */}
          <div>
            <Label>Amenities:</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {amenities.map((amenity) => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="mr-2"
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-yellow-600 font-semibold text-white"
            >
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
