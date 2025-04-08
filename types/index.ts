import { Decimal } from "@prisma/client/runtime/library";

export type Property = {
  id: string;
  ownerId: string;
  name: string;
  type: string;
  category: string;
  description: string | null;
  isForSale: boolean;
  locationId: string;
  beds: number;
  baths: number;
  squareFeet: number;
  amenities: string[];
  images: string[];
  videoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  price: string | null;
  discount: string | null;
  discountPrice?: string | null;
  location: {
    id: string;
    street: string | null;
    city: string | null;
    state: string | null;
    zipcode: string | null;
    country: string | null;
  };
  rates: {
    id: string;
    nightly: Decimal | null;
    weekly: Decimal | null;
    monthly: Decimal | null;
  } | null;
  sellerInfo: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  owner: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

export type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  firstName: string | null;
  lastName: string | null;
};
