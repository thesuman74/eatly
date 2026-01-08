"use client";

import { ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const faqs = [
  {
    q: "How quickly can I get started?",
    a: "You can start with a free account in under 2 minutes. Upload your first menu and see the magic happen instantly!",
  },
  {
    q: "What file formats do you support?",
    a: "We support PDF, JPG, PNG, and Word documents. Our AI handles any restaurant menu format perfectly.",
  },
  {
    q: "Is there a setup fee?",
    a: "No setup fees! Start free with up to 5 menus. Upgrade anytime as your needs grow.",
  },
  {
    q: "How secure is our data?",
    a: "Enterprise-grade security with 99.9% uptime SLA, end-to-end encryption, and daily backups. Your data is safe.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
    <div ref={containerRef} className="space-y-3 max-w-3xl mx-auto">
      {faqs.map((faq, index) => {
        const isRevealed = revealedItems.has(index);
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            data-index={index}
            className={`transition-all duration-500 ${
              isRevealed
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: isRevealed ? `${index * 50}ms` : "0ms",
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full p-6 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm hover:bg-card/60 hover:border-accent/30 transition-all duration-300 text-left group"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                  {faq.q}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-accent transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isOpen && (
                <p className="mt-4 text-muted-foreground text-sm leading-relaxed animate-fade-in-up">
                  {faq.a}
                </p>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
