import { ProductCategoryTypes } from "@/lib/types/menu-types";

export const ProductCategoriesData: ProductCategoryTypes[] = [
  {
    id: "cat-tea-specials",
    name: "Tea Specials",
    slug: "tea-specials",
    position: 0,
    // description: "A selection of our finest tea specials.",
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
    position: 2,
    // description: "Delicious desserts for your sweet tooth.",
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
    id: "rat-desserts",
    name: "Desserts",
    slug: "desserts",
    position: 3,
    // description: "Delicious desserts for your sweet tooth.",
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
    position: 1,
    // description: "Refreshing drinks to keep you hydrated.",
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

// const menuItems = {
//   "Tea Specials": [
//     {
//       id: "1",
//       title: "Masala Tea",
//       description:
//         "Masala Chai is an Indian beverage made by brewing black tea with fragrant spices and herbs.",
//       price: "  500",
//       image: "/Images/coffee.png",
//     },
//     {
//       id: "2",
//       title: "Green Tea",
//       description:
//         "Green tea contains antioxidants and other compounds that may help with overall health.",
//       price: "  400",
//       image: "/Images/coffee.png",
//     },
//     {
//       id: "3",
//       title: "Lemon Tea",
//       description:
//         "Lemon tea is a refreshing tea where lemon juice is added in black or green tea.",
//       price: "  450",
//       image: "/Images/coffee.png",
//     },
//   ],
//   Coffee: [
//     {
//       id: "1",
//       title: "Cappuccino",
//       description:
//         "Espresso with steamed milk foam, perfect balance of coffee and milk.",
//       price: "  600",
//       image: "/Images/coffee.png",
//     },
//     {
//       id: "2",
//       title: "Latte",
//       description: "Espresso with steamed milk and a light layer of milk foam.",
//       price: "  550",
//       image: "/Images/coffee.png",
//     },
//   ],
//   Breakfast: [
//     {
//       id: "1",
//       title: "English Breakfast",
//       description: "Eggs, bacon, toast, and beans served with tea or coffee.",
//       price: "  1200",
//       image: "/Images/coffee.png",
//     },
//     {
//       id: "2",

//       title: "Continental",
//       description:
//         "Croissant, jam, butter, and fresh fruits with your choice of beverage.",
//       price: "  1000",
//       image: "/Images/coffee.png",
//     },
//   ],
// };
