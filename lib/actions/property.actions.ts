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
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
}

//Get latest properties
export async function getLatestProperties() {
  const data = await prisma.property.findMany({
    include: {
      location: true,
      rates: true,
      owner: true,
      sellerInfo: true,
    },
    take: 6,
    orderBy: { createdAt: "desc" },
  });
  return convertToPlainObject(data);
}

export async function getPropertyById(id: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        owner: true,
        location: true,
        rates: true,
        sellerInfo: true,
      },
    });

    if (!property) {
      throw new Error("Property not found");
    }

    return convertToPlainObject(property);
  } catch (error) {
    console.error("Error getting property:", error);
    throw error;
  }
}

export async function addProperty(prevState: unknown, formData: FormData) {
  try {
    console.log("About creating properties");

    const session = await auth();

    const listingTitle = formData.get("listingTitle") as string;
    const category = formData.get("category") as string;
    const type = formData.get("type") as string;
    const country = formData.get("country") as string;
    const state = formData.get("state") as string;
    const actualPrice = formData.get("actualPrice") as string;
    const discountPrice = formData.get("discountPrice") as string;
    const description = formData.get("description") as string;
    const amenities = formData.getAll("amenities") as string[];
    const beds = parseInt(formData.get("beds") as string);
    const baths = parseInt(formData.get("baths") as string);
    const squareFeet = parseInt(formData.get("square_feet") as string);
    const sellerName = formData.get("seller_info.name") as string;
    const sellerEmail = formData.get("seller_info.email") as string;
    const sellerPhone = formData.get("seller_info.phone") as string;

    const imageFiles = formData.getAll("images") as File[];
    const videoFile = formData.get("video") as File;

    const uploadedImages = await Promise.all(
      imageFiles.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadRes = await new Promise<CloudinaryUploadResponse>(
          (resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: "drive-vest/images" }, (err, result) => {
                if (err || !result) return reject(err);
                resolve(result);
              })
              .end(buffer);
          }
        );
        return uploadRes.secure_url;
      })
    );

    let videoUrl = null;
    if (videoFile) {
      const buffer = Buffer.from(await videoFile.arrayBuffer());
      const uploadRes = await new Promise<CloudinaryUploadResponse>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "drive-vest/videos", resource_type: "video" },
              (err, result) => {
                if (err || !result) return reject(err);
                resolve(result);
              }
            )
            .end(buffer);
        }
      );
      videoUrl = uploadRes.secure_url;
    }

    const isForSale = type === "For Sale";
    const validated = propertyCreateSchema.parse({
      name: listingTitle,
      type: category,
      description,
      isForSale,
      price: actualPrice.replace(/,/g, ""),
      discount: discountPrice.replace(/,/g, ""),
      beds,
      baths,
      squareFeet,
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
      rates: isForSale
        ? undefined
        : {
            nightly: (formData.get("rates.nightly") as string) || "0",
            weekly: (formData.get("rates.weekly") as string) || "0",
            monthly: (formData.get("rates.monthly") as string) || "0",
          },
      sellerInfo: isForSale
        ? {
            name: sellerName || session?.user?.name,
            email: sellerEmail || session?.user?.email,
            phone: sellerPhone || "",
          }
        : undefined,
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

    // Save rates if it's a rental property
    let rates = null;
    if (!isForSale && validated.rates) {
      rates = await prisma.rates.create({
        data: {
          nightly: validated.rates.nightly || 0,
          weekly: validated.rates.weekly || 0,
          monthly: validated.rates.monthly || 0,
        },
      });
    }

    // Save seller info if it's a sale property
    let sellerInfo = null;
    if (isForSale && validated.sellerInfo) {
      sellerInfo = await prisma.sellerInfo.create({
        data: {
          name: validated.sellerInfo.name || "",
          email: validated.sellerInfo.email || "",
          phone: validated.sellerInfo.phone || "",
        },
      });
    }

    // Create property
    await prisma.property.create({
      data: {
        ownerId: session?.user?.id || "",
        name: validated.name,
        type: validated.type,
        description: validated.description,
        isForSale: isForSale,
        price: validated.price || 0,
        discount: validated.discount || 0,
        beds: validated.beds,
        baths: validated.baths,
        squareFeet: validated.squareFeet,
        amenities: validated.amenities,
        images: validated.images,
        videoUrl: validated.videoUrl,
        isFeatured: validated.isFeatured,
        locationId: location.id,
        ratesId: rates?.id,
        sellerInfoId: sellerInfo?.id,
      },
    });
    redirect("/properties");
    return { success: false, message: "successfully added property" };
  } catch (error) {
    console.log(error);
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

// get all properties by user
export async function getPropertiesByUser() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("User ID is required");
    }

    const properties = await prisma.property.findMany({
      where: { ownerId: userId },
      include: {
        owner: true,
        location: true,
        rates: true,
        sellerInfo: true,
      },
    });

    return convertToPlainObject(properties);
  } catch (error) {
    console.error("Error getting properties:", error);
    throw error;
  }
}

// delete property owner by id
export async function deletePropertyById(propertyId: Property["id"]) {
  const property = await prisma.property.delete({
    where: { id: propertyId },
  });
  return convertToPlainObject(property);
}

// edit property by id
// use the same flow for add property

export async function editPropertyById(
  propertyId: Property["id"],
  formData: FormData
) {
  try {
    console.log("About editing properties");

    const session = await auth();

    const listingTitle = formData.get("listingTitle") as string;
    const category = formData.get("category") as string;
    const type = formData.get("type") as string;
    const country = formData.get("country") as string;
    const state = formData.get("state") as string;
    const actualPrice = formData.get("actualPrice") as string;
    const discountPrice = formData.get("discountPrice") as string;
    const description = formData.get("description") as string;
    const amenities = formData.getAll("amenities") as string[];
    const beds = parseInt(formData.get("beds") as string);
    const baths = parseInt(formData.get("baths") as string);
    const squareFeet = parseInt(formData.get("square_feet") as string);
    const sellerName = formData.get("seller_info.name") as string;
    const sellerEmail = formData.get("seller_info.email") as string;
    const sellerPhone = formData.get("seller_info.phone") as string;

    const imageFiles = formData.getAll("images") as File[];
    const videoFile = formData.get("video") as File;

    const uploadedImages = await Promise.all(
      imageFiles.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadRes = await new Promise<CloudinaryUploadResponse>(
          (resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: "drive-vest/images" }, (err, result) => {
                if (err || !result) return reject(err);
                resolve(result);
              })
              .end(buffer);
          }
        );

        return uploadRes.secure_url;
      })
    );

    let videoUrl = null;
    if (videoFile) {
      const buffer = Buffer.from(await videoFile.arrayBuffer());

      const uploadRes = await new Promise<CloudinaryUploadResponse>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "drive-vest/videos", resource_type: "video" },
              (err, result) => {
                if (err || !result) return reject(err);
                resolve(result);
              }
            )
            .end(buffer);
        }
      );
      videoUrl = uploadRes.secure_url;
    }

    const isForSale = type === "For Sale";
    const validated = propertyCreateSchema.parse({
      name: listingTitle,
      type: category,
      description,
      isForSale,
      price: actualPrice.replace(/,/g, ""),
      discount: discountPrice.replace(/,/g, ""),
      beds,
      baths,
      squareFeet,
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
      rates: isForSale
        ? undefined
        : {
            nightly: (formData.get("rates.nightly") as string) || "0",
            weekly: (formData.get("rates.weekly") as string) || "0",
            monthly: (formData.get("rates.monthly") as string) || "0",
          },
      sellerInfo: isForSale
        ? {
            name: sellerName || session?.user?.name,
            email: sellerEmail || session?.user?.email,
            phone: sellerPhone || "",
          }
        : undefined,
    });

    // Save location
    const location = await prisma.location.update({
      where: { id: propertyId },
      data: {
        street: validated.location.street,
        city: validated.location.city,
        state: validated.location.state,
        zipcode: validated.location.zipcode,
      },
    });

    // Save rates if it's a rental property
    let rates = null;
    if (!isForSale && validated.rates) {
      rates = await prisma.rates.update({
        where: { id: propertyId },
        data: {
          nightly: validated.rates.nightly || 0,
          weekly: validated.rates.weekly || 0,
          monthly: validated.rates.monthly || 0,
        },
      });
    }

    // Save seller info if it's a sale property
    let sellerInfo = null;
    if (isForSale && validated.sellerInfo) {
      sellerInfo = await prisma.sellerInfo.update({
        where: { id: propertyId },
        data: {
          name: validated.sellerInfo.name || "",
          email: validated.sellerInfo.email || "",
          phone: validated.sellerInfo.phone || "",
        },
      });
    }

    // Update property
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        name: validated.name,
        type: validated.type,
        description: validated.description,
        isForSale: isForSale,
        price: validated.price || 0,
        discount: validated.discount || 0,
        beds: validated.beds,
        baths: validated.baths,
        squareFeet: validated.squareFeet,
        amenities: validated.amenities,
        images: validated.images,
        videoUrl: validated.videoUrl,
        isFeatured: validated.isFeatured,
        locationId: location.id,
        ratesId: rates?.id,
        sellerInfoId: sellerInfo?.id,
      },
    });

    toast.success("Property updated successfully");

    redirect("/properties");

    return { success: false, message: "successfully updated property" };
  } catch (error) {
    console.log(error);
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}
