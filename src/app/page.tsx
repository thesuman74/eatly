"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/home/NavBar";
import { HeroSection } from "@/components/home/HeroSection";
import { BentoFeatures } from "@/components/home/BentoFeatures";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQSection } from "@/components/home/FaqSection";

export default function Home() {
  return (
    <div className="overflow-hidden bg-background">
      <NavBar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section with Bento Grid */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-sm">
              <span className="text-sm font-medium text-accent">
                Premium Features
              </span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-display font-bold text-balance mb-6">
              Everything You Need to <span className="text-accent">Thrive</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Powerful tools designed to streamline operations and delight your
              customers
            </p>
          </div>

          <BentoFeatures />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card/30 border-y border-border/20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl sm:text-5xl font-display font-bold text-balance">
                Why Restaurants Choose{" "}
                <span className="text-accent">Eatly</span>
              </h2>
              <ul className="space-y-4">
                {[
                  "Save 10+ hours per week on menu management",
                  "Reduce data entry errors by 95%",
                  "Improve customer experience with consistent branding",
                  "Scale your operations effortlessly",
                  "Make data-driven business decisions",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-4 group">
                    <div className="w-6 h-6 rounded-full bg-accent/30 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/50 transition-all">
                      <svg
                        className="w-4 h-4 text-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-foreground group-hover:text-accent transition-colors">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Restaurants Using", value: "2,500+" },
                { label: "Menus Processed", value: "50K+" },
                { label: "Time Saved (hrs)", value: "125K+" },
                { label: "Uptime", value: "99.9%" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 hover:border-accent/50 transition-all duration-300 group cursor-pointer"
                >
                  <p className="text-3xl font-bold text-accent group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-display font-bold text-balance mb-6">
              Loved by <span className="text-accent">Restaurants</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              See how Eatly transformed their businesses
            </p>
          </div>

          <Testimonials />
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-card/30 border-y border-border/20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-display font-bold text-balance mb-6">
              Questions? We Have <span className="text-accent">Answers</span>
            </h2>
          </div>

          <FAQSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-accent/30 to-accent/5 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2s" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-6xl sm:text-7xl font-display font-bold text-balance mb-8">
            Ready to <span className="text-accent">Transform</span> Your
            Restaurant?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance">
            Join thousands of restaurant owners already saving time and money
            with Eatly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/30 group"
            >
              Start Your Free Trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border/40 hover:bg-card/50 bg-transparent"
            >
              Schedule a Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-8">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border/20 bg-card/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/20 pt-8 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2025 Eatly. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
