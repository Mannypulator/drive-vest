import { hashSync } from "bcrypt-ts-edge";

const sampleData = {
  users: [
    {
      username: "John",
      email: "admin@example.com",
      password: hashSync("123456", 10),
      role: "admin",
    },
    {
      username: "Jane",
      email: "user@example.com",
      password: hashSync("123456", 10),
      role: "user",
    },
  ],
  properties: [
    {
      id: "67a0ceb9f32c41df65a172ab",
      owner: "14886961-c556-479e-a79e-596882a3bd98",
      name: "Palatial Residence",
      price: 22000000.0,
      discount: 250000.0,
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
        weekly: 2000.0,
        monthly: 6000.0,
        nightly: 400.0,
      },
      seller_info: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1-234-567-8901",
      },
      images: ["/images/property1.svg"],
      videoUrl: "",
      isFeatured: true,
      createdAt: "2025-02-03T14:12:09.984Z",
      updatedAt: "2025-02-03T14:35:13.050Z",
      __v: 0,
    },
    {
      id: "67a0cec9f32c41df65a172ac",
      owner: "704ecbd9-4f33-4bdc-bf60-ef8cb2d58198",
      name: "Skyline Penthouse",
      price: 22000000.0,
      discount: 250000.0,
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
        weekly: 500.0,
        monthly: 1500.0,
        nightly: 800.0,
      },
      seller_info: {
        name: "Emily Johnson",
        email: "emily.johnson@example.com",
        phone: "+1-345-678-9012",
      },
      images: [
        "/images/property1.svg",
        "/images/property2.svg",
        "/images/property3.svg",
      ],
      videoUrl: "",
      isFeatured: false,
      createdAt: "2025-02-10T10:22:30.984Z",
      updatedAt: "2025-02-11T15:45:21.030Z",
      __v: 0,
    },
  ],
};

export default sampleData;
