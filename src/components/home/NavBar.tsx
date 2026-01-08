"use client";

import { ChefHat, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/20 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 bg-gradient-to-br from-accent via-accent/80 to-accent/60 rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-all duration-300">
              <ChefHat className="w-5 h-5 text-background" />
            </div>
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Eatly
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              FAQ
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button size="sm" variant="ghost" className="hidden sm:flex">
                Sign In
              </Button>
            </Link>

            <Link href="/register">
              <Button
                size="sm"
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20"
              >
                Get Started
              </Button>
            </Link>
            <button
              className="md:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/20 py-4 space-y-2">
            <a
              href="#features"
              className="block px-4 py-2 rounded-lg hover:bg-card/50 transition-colors"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="block px-4 py-2 rounded-lg hover:bg-card/50 transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="block px-4 py-2 rounded-lg hover:bg-card/50 transition-colors"
            >
              FAQ
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
