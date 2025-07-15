import { ProductCategoryTypes } from "@/lib/types/menu-types";

export const ProductCategoriesData: ProductCategoryTypes[] = [
  {
    id: "cat-tea-specials",
    name: "Tea Specials",
    slug: "tea-specials",
    description: "A selection of our finest tea specials.",
    products: [
      {
        id: "prod-masala-tea",
        name: "Masala Tea",
        slug: "masala-tea",
        description:
          "Spicy and flavorful masala tea made with aromatic spices.",
        price: 500, // price in cents (e.g. Rs 5.00)
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
        description: "Refreshing green tea rich in antioxidants.",
        price: 400,
        currency: "NPR",
        image: {
          url: "/images/coffee.png",
          alt: "Green Tea in a cup",
        },
        available: true,
      },
      {
        id: "prod-lemon-tea",
        name: "Lemon Tea",
        slug: "lemon-tea",
        description: "Zesty lemon-infused tea for a refreshing taste.",
        price: 500,
        currency: "NPR",
        image: {
          url: "/images/coffee.png",
          alt: "Lemon Tea in a cup",
        },
        available: true,
      },
      {
        id: "prod-product-4",
        name: "Product 4",
        slug: "product-4",
        description: "Placeholder product.",
        price: 0,
        currency: "NPR",
        image: {
          url: "/images/coffee.png",
          alt: "Placeholder product image",
        },
        available: false,
      },
    ],
  },
  {
    id: "cat-desserts",
    name: "Desserts",
    slug: "desserts",
    description: "Delicious desserts for your sweet tooth.",
    products: [
      {
        id: "prod-chocolate-cake",
        name: "Chocolate Cake",
        slug: "chocolate-cake",
        description: "Rich and moist chocolate cake with creamy frosting.",
        price: 2200,
        currency: "NPR",
        image: {
          url: "/images/coffee.png",
          alt: "Chocolate cake slice",
        },
        available: true,
      },
      {
        id: "prod-acai",
        name: "Açaí",
        slug: "acai",
        description: "Açaí bowl topped with fresh fruits and granola.",
        price: 1500,
        currency: "NPR",
        image: {
          url: "/images/coffee.png",
          alt: "Acai bowl",
        },
        available: true,
      },
    ],
  },
  {
    id: "cat-drinks",
    name: "Drinks",
    slug: "drinks",
    description: "Refreshing drinks to keep you hydrated.",
    products: [
      {
        id: "prod-water",
        name: "Water",
        slug: "water",
        description: "Fresh mineral water.",
        price: 600,
        currency: "NPR",
        image: {
          url: "/images/coffee.png",
          alt: "Bottle of water",
        },
        available: true,
      },
      {
        id: "prod-coca-cola",
        name: "Coca Cola",
        slug: "coca-cola",
        description: "Classic Coca Cola soft drink.",
        price: 800,
        currency: "NPR",
        image: {
          url: "/images/coffee.png",
          alt: "Coca Cola bottle",
        },
        available: true,
      },
    ],
  },
];
