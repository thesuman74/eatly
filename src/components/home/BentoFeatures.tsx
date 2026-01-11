"use client";

import {
  Upload,
  Zap,
  BarChart3,
  Settings2,
  Users,
  ImageIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: Upload,
    title: "Smart Menu Upload",
    description:
      "Upload your menu in any format. Our AI instantly recognizes and extracts every item.",
    span: "col-span-1 row-span-1",
  },
  {
    icon: Zap,
    title: "Auto Menu Extraction",
    description:
      "Intelligent image recognition extracts high-quality photos from your menus.",
    span: "col-span-1 row-span-1",
  },
  {
    icon: BarChart3,
    title: "Auto Categorization",
    description:
      "Automatically categorize menu items into cuisines, types, and dietary preferences.",
    span: "col-span-1 row-span-1",
  },
  {
    icon: ImageIcon,
    title: "Image Assignment",
    description:
      "Perfect visual presentation with automated image assignment to each menu item.",
    span: "col-span-1 row-span-1",
  },
  {
    icon: Settings2,
    title: "Management Dashboard",
    description:
      "Centralized control panel with real-time analytics and business insights.",
    span: "md:col-span-2 col-span-1 row-span-1",
  },
  {
    icon: Users,
    title: "Role-Based Staff Management",
    description:
      "Manage your team with granular permissions and custom access levels.",
    span: "md:col-span-2 col-span-1 row-span-1",
  },
];

export function BentoFeatures() {
  const [revealedItems, setRevealedItems] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(
              (entry.target as HTMLElement).dataset.index || "0"
            );
            setRevealedItems((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.2 }
    );

    containerRef.current
      ?.querySelectorAll("[data-index]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-max"
    >
      {features.map((feature, index) => {
        const Icon = feature.icon;
        const isRevealed = revealedItems.has(index);

        return (
          <div
            key={index}
            data-index={index}
            className={`${
              feature.span
            } p-6 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm hover:bg-card/60 hover:border-accent/30 transition-all duration-500 group cursor-pointer overflow-hidden relative ${
              isRevealed
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: isRevealed ? `${index * 50}ms` : "0ms",
            }}
          >
            {/* Animated gradient background on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />

            {/* Content */}
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center mb-4 group-hover:from-accent/50 group-hover:to-accent/20 transition-all duration-300 shadow-lg shadow-accent/10">
                <Icon className="w-6 h-6 text-accent group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
                {feature.description}
              </p>
            </div>

            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-accent/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        );
      })}
    </div>
  );
}
