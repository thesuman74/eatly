import type { Metadata } from "next";
import { Geist, Quicksand } from "next/font/google";
import "./globals.css";
import Provider from "@/components/HOC/Providers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserOnboardingStatus } from "@/lib/supabase/getUserOnboardingStatus";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eatly - Restaurant Management Made Simple",
  description:
    "Automate menu management, extract photos intelligently, and manage your entire restaurant from one powerful dashboard.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body
        className={`${quicksand.className} antialiased max-w-full overflow-x-hidden `}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
