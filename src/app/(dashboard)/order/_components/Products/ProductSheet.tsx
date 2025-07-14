"use client";

import ProductSearch from "./ProductSearch";
import ProductCategory from "./ProductCategories";
import ProductSidebar from "./ProductSidebar";

type ProductSheetProps = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

const ProductSheet = ({ open, setOpen }: ProductSheetProps) => {
  const categories = [
    {
      name: "Tea Specials",
      products: [
        { name: "Masala Tea", price: 5, img: "/tea-masala.jpg" },
        { name: "Green Tea", price: 4, img: "/tea-green.jpg" },
        { name: "Lemon Tea", price: 5, img: "" },
        { name: "Product 4", price: 0, img: "" },
      ],
    },
    {
      name: "Desserts",
      products: [
        { name: "Chocolate cake", price: 22, img: "/cake.jpg" },
        { name: "Açaí", price: 15, img: "/acai.jpg" },
      ],
    },
    {
      name: "Drinks",
      products: [
        { name: "Water", price: 6, img: "/water.jpg" },
        { name: "Coca Cola", price: 8, img: "/coke.jpg" },
      ],
    },
  ];

  if (!open) return null;

  return (
    <div className="w-fit fixed top-20 z-10  h-full flex bg-white">
      {/* Sidebar */}
      <ProductSidebar categories={categories} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <ProductSearch />
          <h2 className="text-gray-700 text-lg font-semibold">PRODUCTS</h2>
        </div>

        {categories.map((category) => (
          <ProductCategory
            key={category.name}
            name={category.name}
            products={category.products}
          />
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={() => setOpen && setOpen(false)}
        className="absolute top-0 right-4 text-gray-500 hover:text-gray-700 text-xl"
      >
        ✕
      </button>
    </div>
  );
};

export default ProductSheet;
