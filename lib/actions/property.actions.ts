"use server";
import { prisma } from "@/data/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { Property } from "@/types";
import { PropertyCreateSchema } from "../validators";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "../getSessionUser";

//Get latest properties
export async function getLatestProperties() {
  const data = await prisma.property.findMany({
    include: { location: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(data);
}

export async function getPropertyById(propertyId: Property["id"]) {
  const property = await prisma.property.findFirst({
    where: { id: propertyId },
    include: {
      owner: true,
      location: true,
      rates: true,
      sellerInfo: true, // Make sure to include this if needed
    },
  });

  return property ? convertToPlainObject(property) : null;
}

export async function AddProperty(data: z.infer<typeof PropertyCreateSchema>) {
  try {
    const sessionUser = await getSessionUser();
    const validatedData = PropertyCreateSchema.parse(data);

    const { location, rates, sellerInfo, ...propertyData } = validatedData;

    // const imageUrls = [];

    // for (const imageFile of images) {
    //   const imageBuffer = await imageFile.arrayBuffer();
    //   const imageArray = Array.from(new Uint8Array(imageBuffer));
    //   const imageData = Buffer.from(imageArray);

    //   // Convert the image data to base64
    //   const imageBase64 = imageData.toString("base64");

    //   // Make request to upload to Cloudinary
    //   const result = await cloudinary.uploader.upload(
    //     `data:image/png;base64,${imageBase64}`,
    //     {
    //       folder: "propertypulse",
    //     }
    //   );

    //   imageUrls.push(result.secure_url);
    // }

    await prisma.property.create({
      data: {
        ...propertyData,
        owner: { connect: { id: sessionUser?.userId } },
        location: {
          create: {
            ...location,

            street: location.street || null,
            city: location.city || null,
            state: location.state || null,
            zipcode: location.zipcode || null,
          },
        },
        rates: {
          create: {
            ...rates,
            nightly: rates.nightly || null,
            weekly: rates.weekly || null,
            monthly: rates.monthly || null,
          },
        },
        sellerInfo: {
          create: {
            ...sellerInfo,
            // Ensure empty strings are converted to null
            name: sellerInfo.name || null,
            email: sellerInfo.email || null,
            phone: sellerInfo.phone || null,
          },
        },
      },
      include: {
        location: true,
        rates: true,
        sellerInfo: true,
      },
    });

    revalidatePath("/properties");

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
