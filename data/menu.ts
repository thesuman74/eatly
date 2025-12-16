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
        category_id: "cat-tea-specials",
        position: 0,
        images: [
          {
            url: "/images/coffee.png",
            alt: "Masala Tea in a cup",
            id: "",
            is_primary: false,
            product_id: "",
            sort_order: 0,
          },
        ],
        available: true,
        isVisible: false,
      },
    ],
    isVisible: false,
    available: false,
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
