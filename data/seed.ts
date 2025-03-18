import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";
// import { hash } from "@/lib/encrypt";


async function main() {
  console.log("🌱 Seeding database...");


  const prisma = new PrismaClient();
  await prisma.property.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
//   await prisma.user.deleteMany();

  for (const property of sampleData.properties) {
    // 🔹 Create location first
    const location = await prisma.location.create({
      data: {
        street: property.location.street,
        city: property.location.city,
        state: property.location.state,
        zipcode: property.location.zipcode,
      },
    });

    // 🔹 Create rates
    const rates = await prisma.rates.create({
      data: {
        nightly: property.rates?.nightly || 0,
        weekly: property.rates?.weekly || 0,
        monthly: property.rates?.monthly || 0,
      },
    });

    // 🔹 Create seller info
    const sellerInfo = await prisma.sellerInfo.create({
      data: {
        name: property.seller_info?.name || "Unknown",
        email: property.seller_info?.email || "unknown@example.com",
        phone: property.seller_info?.phone || "000-000-0000",
      },
    });

    // 🔹 Create property referencing IDs
    await prisma.property.create({
      data: {
        ownerId: property.owner,
        name: property.name,
        type: property.type,
        price: property.price,
        discount: property.discount,
        description: property.description,
        beds: property.beds,
        baths: property.baths,
        squareFeet: property.square_feet || 1000, // Default to 1000 if missing
        amenities: property.amenities || [],
        images: property.images || [],
        videoUrl: property.videoUrl || "",
        isFeatured: property.isFeatured || false,
        locationId: location.id,
        ratesId: rates.id,
        sellerInfoId: sellerInfo.id,
      },
    });
  }


  console.log("✅ Database seeded successfully!");
}

main();
