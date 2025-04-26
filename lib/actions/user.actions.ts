"use server";

import { prisma } from "@/data/prisma";
import { signInFormSchema, signUpFormSchema } from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { hashSync } from "bcrypt-ts-edge";

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    console.log(user);

    await signIn("credentials", user);
    console.log("Logged in successfully");

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    console.log(`error:${error}`);
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid email or password" };
  }
}

export async function signOutUser() {
  await signOut();
}

export async function signUpUser(prevState: unknown, formData: FormData) {
  console.log("inside sign up action");
  console.log(formData.get("email"));
  try {
    const user = signUpFormSchema.parse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phoneNumber: formData.get("phoneNumber"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    console.log(`user request: ${user}`);

    console.log(user);

    const plainPassword = user.password;

    console.log(plainPassword);

    user.password = hashSync(user.password);

    await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.firstName,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    console.log(error);
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

export async function checkBookmarkStatus(propertyId: string) {
  const session = await auth();
  if (!session) {
    return {
      success: false,
      message: "You must be logged in to bookmark a property",
    };
  }

  const bookmark = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
      bookmarks: {
        some: {
          id: propertyId,
        },
      },
    },
  });

  return { success: true, isBookmarked: bookmark ? true : false };
}

export async function bookmarkProperty(propertyId: string) {
  const session = await auth();
  if (!session) {
    return {
      success: false,
      message: "You must be logged in to bookmark a property",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
  });

  if (!user) {
    return { success: false, message: "User not found" };
  }

  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    return { success: false, message: "Property not found" };
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      bookmarks: {
        connect: {
          id: propertyId,
        },
      },
    },
  });

  return { success: true, message: "Property bookmarked successfully" };
}

export async function getBookmarkedProperties() {
  const session = await auth();
  if (!session) {
    return {
      success: false,
      message: "You must be logged in to view your bookmarks",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
    include: {
      bookmarks: {
        include: {
          location: true,
          rates: true,
          sellerInfo: true,
        },
      },
    },
  });

  console.log(user);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  return {
    success: true,
    properties: convertToPlainObject(user.bookmarks),
  };
}
