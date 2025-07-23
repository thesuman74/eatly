"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MoveLeft } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const sampleData = [
  {
    id: "cat-tea-specials",
    name: "Tea Specials",
    slug: "tea-specials",
    description: "",
    products: [
      {
        id: "prod-masala-tea",
        name: "Masala Tea",
        slug: "masala-tea",
        description: "",
        price: 500,
        currency: "NPR",
        image: {
          url: "/images/coffee.png",
          alt: "Masala Tea in a cup",
        },
        available: true,
      },
      {
        id: "prod-green-tea",
        name: "Green Tea",
        slug: "green-tea",
        description: "",
        price: 400,
        currency: "NPR",
        image: {
          url: "/images/coffee.png",
          alt: "Green Tea in a cup",
        },
        available: true,
      },
    ],
  },
  {
    id: "cat-cold-coffees",
    name: "Cold Coffees",
    slug: "cold-coffees",
    description: "",
    products: [
      {
        id: "prod-iced-latte",
        name: "Iced Latte",
        slug: "iced-latte",
        description: "",
        price: 600,
        currency: "NPR",
        image: {
          url: "/images/coffee.png",
          alt: "Iced Latte in a glass",
        },
        available: true,
      },
      {
        id: "prod-vanilla-frost",
        name: "Vanilla Frost",
        slug: "vanilla-frost",
        description: "",
        price: 650,
        currency: "NPR",
        image: {
          url: "/images/coffee.png",
          alt: "Vanilla Frost served cold",
        },
        available: true,
      },
    ],
  },
];

interface PreviewMenuFormProps {
  reviewMenu: boolean;
  setReviewMenu: (open: boolean) => void;
}

export default function PreviewMenuForm({
  reviewMenu,
  setReviewMenu,
}: PreviewMenuFormProps) {
  const [selectedCategory, setSelectedCategory] = useState(sampleData[0]);
  const router = useRouter();

  const handleSubmit = () => {
    // TODO: Gather form data and send to backend
    toast.success("Menu submitted successfully!");
    setTimeout(() => router.push("/products"), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <span className="px-8">
        <MoveLeft
          className="cursor-pointer"
          onClick={() => setReviewMenu(false)}
        />
      </span>
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Review Extracted Menu
      </h2>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {sampleData.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory.id === cat.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.name} ({cat.products.length})
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {selectedCategory.products.map((product) => (
          <Card key={product.id} className="p-4 flex flex-col gap-4">
            <div className="flex justify-center">
              <img
                src={product.image.url}
                alt={product.image.alt}
                className="w-24 h-24 object-cover rounded"
              />
            </div>

            <div>
              <Label htmlFor={`name-${product.id}`}>Name</Label>
              <Input
                id={`name-${product.id}`}
                defaultValue={product.name}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor={`price-${product.id}`}>Price (in NPR)</Label>
              <Input
                id={`price-${product.id}`}
                type="number"
                defaultValue={product.price}
                className="mt-1"
              />
            </div>

            {/* <div>
              <Label htmlFor={`desc-${product.id}`}>Description</Label>
              <Textarea
                id={`desc-${product.id}`}
                defaultValue={product.description}
                className="mt-1"
                rows={2}
              />
            </div> */}
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button onClick={handleSubmit} className="text-lg px-6 py-2">
          Submit Menu
        </Button>
      </div>
    </div>
  );
}
