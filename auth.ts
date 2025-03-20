/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { Account, NextAuthConfig, Profile } from "next-auth";
import { authConfig } from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/data/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { compareSync } from "bcrypt-ts-edge";

export const config = {
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        let user = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.email,
              username: profile.given_name || profile.email.split("@")[0],
              image: profile.picture,
            },
          });
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
        };
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      async profile(profile) {
        let user = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.email,
              username: profile.given_name || profile.email.split("@")[0], // Ensure username exists
              image: profile.picture?.data?.url,
            },
          });
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          image: user.image,
        };
      },
    }),
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        console.log(`Credentials: ${credentials}`);

        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });

        console.log(user);

        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          console.log(isMatch);
          if (isMatch) {
            return {
              id: user.id,
              email: user.email,
              role: user.role,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({
      account,
      profile,
    }: {
      account: Account | null;
      profile?: Profile;
    }) {
      if (account?.provider === "credentials") {
        // Credentials already validated in authorize(), allow sign-in
        return true;
      }
      console.log(profile);
      if (!profile?.email) return false; // Ensure email exists

      let existingUser = await prisma.user.findUnique({
        where: { email: profile.email },
        include: { account: true }, // Include linked accounts
      });

      console.log(existingUser);

      if (existingUser) {
        // ✅ Check if the user has the same provider
        const existingAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account?.provider || "",
              providerAccountId: account?.providerAccountId || "",
            },
          },
        });

        if (!existingAccount && account) {
          // ✅ If user exists but doesn't have this provider, link it
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state
                ? String(account.session_state)
                : null,
            },
          });
        }

        return true;
      } else if (
        account?.provider === "google" ||
        account?.provider === "facebook" ||
        account?.provider === "credentials"
      ) {
        // ✅ Create a new user and link the provider
        existingUser = await prisma.user.create({
          data: {
            email: profile.email,
            username: profile.name || profile.email.split("@")[0], // Default username
            image: profile.image ? String(profile.image) : null,
            role: "user", // Default role
            account: {
              create: [
                {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  type: account.type,
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state
                    ? String(account.session_state)
                    : null,
                },
              ],
            },
          },
          include: {
            account: true, // Ensure the account relation is included
          },
        });

        return true;
      }

      return false;
    },

    async session({ session, user, trigger, token }: any) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.email = token.email;
      session.user.name = token.username;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      console.log(session);

      if (trigger === "update") {
        session.user.email = user.email;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        console.log(`user:${user}`);
        console.log(`token:${token}`);
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        console.log(token);
      }

      if (session?.user.email && trigger === "update") {
        token.email = session.user.email;
      }

      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
