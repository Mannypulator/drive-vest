import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exactly two decimal places"
  );

export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Schema for signing up a user
export const signUpFormSchema = z.object({
  firstName: z.string().min(3, "FirstName must be at least 3 characters"),
  lastName: z.string().min(3, "LastName must be at least 3 characters"),
  phoneNumber: z.string().min(3, "PhoneNumber must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(7, "Password must be at least 7 characters"),
});



const LocationSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
});

// Rates Schema
const RatesSchema = z.object({
  nightly: currency,
  weekly: currency,
  monthly: currency,
});

// SellerInfo Schema
const SellerInfoSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const PropertyCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().optional(),
  price: currency,
  discount: currency,
  beds: z.number().int().positive("Beds must be a positive integer"),
  baths: z.number().int().positive("Baths must be a positive integer"),
  squareFeet: z
    .number()
    .int()
    .positive("Square feet must be a positive integer"),
  amenities: z
    .array(z.string().min(1))
    .nonempty("At least one amenity is required"),
  images: z
    .array(z.string().url())
    .nonempty("At least one image URL is required"),
  videoUrl: z.string().url("Invalid video URL format"),
  isFeatured: z.boolean().optional().default(false),
  location: LocationSchema,
  rates: RatesSchema,
  sellerInfo: SellerInfoSchema,
});
