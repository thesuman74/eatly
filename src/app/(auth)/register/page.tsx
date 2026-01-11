"use client";

import { RegisterForm } from "@/components/register-form";
import { ChefHat } from "lucide-react";
import React, { useEffect, useState } from "react";

const images = [
  "/Images/products.png",
  "/Images/scanmenu-gif.gif",
  "/Images/PublicOrderplacement-gif.gif",
];

const Page = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 10000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Column */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="w-9 h-9 bg-gradient-to-br from-accent via-accent/80 to-accent/60 rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-all duration-300">
              <ChefHat className="w-5 h-5 text-background" />
            </div>
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Eatly
            </span>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>

      {/* Right Column - Slideshow */}
      <div className="relative hidden lg:block overflow-hidden">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            className={`absolute inset-0 h-full w-full object-scale-down object-center transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
