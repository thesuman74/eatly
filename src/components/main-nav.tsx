"use client";

import { useState } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const menuCategories = [
  { title: "Tea Specials", href: "#tea-specials" },
  { title: "Coffee", href: "#coffee" },
  { title: "Breakfast", href: "#breakfast" },
  { title: "Desserts", href: "#desserts" },
];

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm mb-2">
      <div className="container flex items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-2 size-20">
          <Image
            src="/Images/logo.png"
            alt="Kaji CHiya Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-bold text-xl text-black w-full ">
            KajiChiya
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="https://instagram.com" target="_blank">
            <Instagram className="w-6 h-6" />
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col space-y-4 mt-6">
                {menuCategories.map((category, index) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg hover:text-primary transition-colors"
                  >
                    <motion.span
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {category.title}
                    </motion.span>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
