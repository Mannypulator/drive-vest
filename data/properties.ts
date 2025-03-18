export interface Property {
  _id: string;
  owner: string;
  name: string;
  type: string;
  price: string;
  discount: string;
  description: string;
  location: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
  beds: number;
  baths: number;
  square_feet: number;
  amenities: string[];
  rates: {
    weekly: number;
    monthly: number;
    nightly: number | null;
  };
  seller_info: {
    name: string | null;
    email: string;
    phone: string;
  };
  images: string[];
  is_featured: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

import property1 from "@/assets/images/property1.svg";
import property2 from "@/assets/images/property2.svg";
import property3 from "@/assets/images/property3.svg";
// import property4 from "@/assets/images/property4.svg";

const Properties: Property[] = [
  {
    _id: "67a0ceb9f32c41df65a172ab",
    owner: "67a0cdaef32c41df65a17290",
    name: "Palatial Residence",
    price: "NGN 22,000,000.00",
    discount: "250,000.00",
    type: "Apartment",
    description: "Awesome residence with luxury amenities.",
    location: {
      street: "75",
      city: "Urban Avenue",
      state: "Chicago",
      zipcode: "60610",
    },
    beds: 10,
    baths: 5,
    square_feet: 1400,
    amenities: [
      "Wifi",
      "Full kitchen",
      "Swimming Pool",
      "Hot Tub",
      "Gym/Fitness Center",
    ],
    rates: {
      weekly: 2000,
      monthly: 6000,
      nightly: null,
    },
    seller_info: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1-234-567-8901",
    },
    images: [property1.src], // ✅ Fix: Use .src for local images
    is_featured: true,
    createdAt: "2025-02-03T14:12:09.984Z",
    updatedAt: "2025-02-03T14:35:13.050Z",
    __v: 0,
  },
  {
    _id: "67a0cec9f32c41df65a172ac",
    owner: "67a0cdaef32c41df65a17291",
    name: "Skyline Penthouse",
    price: "NGN 22,000,000.00",
    discount: "250,000.00",
    type: "Penthouse",
    description: "A breathtaking penthouse with city views.",
    location: {
      street: "120",
      city: "Downtown",
      state: "New York",
      zipcode: "10001",
    },
    beds: 3,
    baths: 2,
    square_feet: 2500,
    amenities: [
      "Private Terrace",
      "Smart Home",
      "Wifi",
      "Concierge Service",
      "Elevator Access",
    ],
    rates: {
      weekly: 5000,
      monthly: 15000,
      nightly: 800,
    },
    seller_info: {
      name: "Emily Johnson",
      email: "emily.johnson@example.com",
      phone: "+1-345-678-9012",
    },
    images: [property1.src, property2.src, property3.src], // ✅ Fix
    is_featured: false,
    createdAt: "2025-02-10T10:22:30.984Z",
    updatedAt: "2025-02-11T15:45:21.030Z",
    __v: 0,
  },
];

export default Properties;
