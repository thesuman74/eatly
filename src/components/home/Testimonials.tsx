"use client";

import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    name: "Marco Rossi",
    role: "Owner, Bella Italia",
    content:
      "Eatly cut our menu management time in half. The AI categorization is spot-on, and our staff loves the dashboard.",
    stars: 5,
  },
  {
    name: "Sarah Chen",
    role: "Manager, The Spice House",
    content:
      "The automatic photo extraction saved us weeks of manual work. Our menu looks more professional than ever.",
    stars: 5,
  },
  {
    name: "James Wilson",
    role: "Chef, Urban Bistro",
    content:
      "Finally, a system that understands restaurant workflows. Implementation was smooth, and support is fantastic.",
    stars: 5,
  },
];

export function Testimonials() {
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
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((testimonial, index) => {
        const isRevealed = revealedItems.has(index);

        return (
          <div
            key={index}
            data-index={index}
            className={`p-6 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm hover:bg-card/60 hover:border-accent/30 transition-all duration-500 group ${
              isRevealed
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: isRevealed ? `${index * 100}ms` : "0ms",
            }}
          >
            <div className="flex gap-1 mb-4">
              {Array(testimonial.stars)
                .fill(0)
                .map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                ))}
            </div>
            <p className="text-foreground mb-6 text-sm leading-relaxed italic">{`"${testimonial.content}"`}</p>
            <div className="border-t border-border/20 pt-4">
              <p className="font-semibold text-foreground">
                {testimonial.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {testimonial.role}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
