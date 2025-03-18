import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../assets/styles/globals.css";
import { ModalProvider } from "@/components/modal-context";
import { Modals } from "@/components/Modals";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeaderOutline from "@/components/HeaderOutline";
import "photoswipe/dist/photoswipe.css";
import { SessionProvider } from "next-auth/react";
const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <ModalProvider>
            <Header />
            <HeaderOutline />
            {children}
            <Modals />
            <Footer />
          </ModalProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
