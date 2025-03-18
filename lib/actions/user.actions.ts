"use server";

import { prisma } from "@/data/prisma";
import { signInFormSchema, signUpFormSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";
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
