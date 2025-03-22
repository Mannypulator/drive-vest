"use server";
import { prisma } from "@/data/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { Property } from "@/types";
// import { PropertyCreateSchema } from "../validators";
// import { z } from "zod";
// import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import cloudinary from "../cloudinary";
import { propertyCreateSchema } from "../validators";

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

export async function addProperty(prevState: unknown, formData: FormData) {
  try {
    console.log("About creating properties");

    const session = await auth();

    const listingTitle = formData.get("listingTitle") as string;
    const category = formData.get("category") as string;
    const country = formData.get("country") as string;
    const state = formData.get("state") as string;
    const actualPrice = formData.get("actualPrice") as string;
    const discountPrice = formData.get("discountPrice") as string;
    const description = formData.get("description") as string;
    const amenities = formData.getAll("amenities") as string[];

    const imageFiles = formData.getAll("images") as File[];
    const videoFile = formData.get("video") as File;

    const uploadedImages = await Promise.all(
      imageFiles.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const uploadRes = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "drive-vest/images" }, (err, result) => {
              if (err || !result) return reject(err);
              resolve(result);
            })
            .end(buffer);
        });
        return uploadRes.secure_url;
      })
    );

    let videoUrl = null;
    if (videoFile) {
      const buffer = Buffer.from(await videoFile.arrayBuffer());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const uploadRes = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "drive-vest/videos", resource_type: "video" },
            (err, result) => {
              if (err || !result) return reject(err);
              resolve(result);
            }
          )
          .end(buffer);
      });
      videoUrl = uploadRes.secure_url;
    }

    const validated = propertyCreateSchema.parse({
      name: listingTitle,
      type: category,
      description,
      price: actualPrice,
      discount: discountPrice,
      beds: 3,
      baths: 2,
      squareFeet: 1200,
      amenities,
      images: uploadedImages,
      videoUrl,
      isFeatured: false,
      location: {
        country,
        state,
        city: "Lagos",
        street: "123 Sample St",
        zipcode: "100001",
      },
      rates: {
        nightly: actualPrice,
        weekly: discountPrice,
        monthly: discountPrice,
      },
      sellerInfo: {
        name: session?.user?.name,
        email: session?.user?.email,
        phone: "",
      },
    });

    // Save location
    const location = await prisma.location.create({
      data: {
        street: validated.location.street,
        city: validated.location.city,
        state: validated.location.state,
        zipcode: validated.location.zipcode,
      },
    });

    // Save rates
    const rates = await prisma.rates.create({
      data: {
        nightly: validated.rates.nightly,
        weekly: validated.rates.weekly,
        monthly: validated.rates.monthly,
      },
    });

    // Save seller info
    const sellerInfo = await prisma.sellerInfo.create({
      data: {
        name: validated.sellerInfo.name,
        email: validated.sellerInfo.email,
        phone: validated.sellerInfo.phone,
      },
    });

    // Save property
    await prisma.property.create({
      data: {
        name: validated.name,
        type: validated.type,
        price: validated.price,
        discount: validated.discount,
        description: validated.description,
        beds: validated.beds,
        baths: validated.baths,
        squareFeet: validated.squareFeet,
        amenities: validated.amenities,
        images: validated.images,
        videoUrl: validated.videoUrl,
        isFeatured: validated.isFeatured,
        locationId: location.id,
        ratesId: rates.id,
        sellerInfoId: sellerInfo.id,
        ownerId: session?.user?.id || "",
      },
    });
    return { success: false, message: "successfully added property" };
  } catch (error) {
    console.log(error);
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}
