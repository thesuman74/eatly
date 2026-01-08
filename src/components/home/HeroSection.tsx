"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center">
      {/* Dynamic gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 -left-40 w-80 h-80 bg-gradient-to-br from-accent/30 to-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        <div
          className="absolute top-1/3 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2s"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div
          className="absolute -bottom-32 left-1/3 w-96 h-96 bg-gradient-to-br from-accent/20 to-accent/5 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4s"
          style={{ transform: `translateY(${scrollY * 0.7}px)` }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-block">
              <div className="px-4 py-2 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-sm group cursor-pointer hover:bg-accent/15 transition-all duration-300">
                <span className="text-sm font-medium text-accent">
                  ✨ Restaurant Tech Made Simple
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-6xl  sm:text-7xl lg:text-7xl font-display font-bold tracking-tighter text-balance leading-tight">
                Manage Your
                <span className="block bg-gradient-to-r from-accent via-accent/80 to-accent/60 bg-clip-text text-transparent">
                  Restaurant Like a Pro
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl text-balance leading-relaxed">
                Automate menu management, extract photos intelligently,
                categorize items effortlessly, and manage your entire restaurant
                from one powerful dashboard.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/30 group"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border/40 hover:bg-card/50 bg-transparent"
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              {[
                { value: "2,500+", label: "Restaurants" },
                { value: "50K+", label: "Menus" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <p className="text-2xl font-bold text-accent">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Showcase */}
          <div className="hidden lg:block animate-fade-in-up animation-delay-200ms">
            <div className="relative">
              {/* Glowing border container */}
              <div className="absolute -inset-1 bg-gradient-to-r from-accent/30 via-accent/10 to-transparent rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse" />

              <div className="relative h-96 bg-gradient-to-br from-card/80 to-card/40 rounded-3xl border border-border/20 overflow-hidden group">
                {/* Animated grid background */}
                <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center gap-6 p-8">
                  <div className="flex gap-3">
                    {["Upload", "Extract", "Manage"].map((text, i) => (
                      <div
                        key={i}
                        className="px-4 py-2 rounded-lg bg-accent/20 text-accent text-sm font-medium border border-accent/30 group-hover:bg-accent/30 transition-all duration-300 animate-fade-in-up"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        {text}
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-muted-foreground max-w-xs">
                    Smart automation for every aspect of your restaurant
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
