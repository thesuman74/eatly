import type { Metadata } from "next";
import { Geist, Quicksand } from "next/font/google";
import "./globals.css";
import Provider from "@/components/HOC/Providers";

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
    "Automate menu management, order tracking, and manage your entire restaurant from one powerful dashboard.",
  icons: {
    icon: "/favicon.ico",
  },
};

<link rel="icon" href="/favicon.ico" sizes="any" />;
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body
        className={`${quicksand.className} antialiased max-w-full overflow-x-hidden `}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
