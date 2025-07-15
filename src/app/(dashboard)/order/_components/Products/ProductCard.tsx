import { ProductCategoryTypes, ProductTypes } from "@/lib/types/menu-types";
import { Info, Plus } from "lucide-react";

const ProductCard = ({ product }: { product: ProductTypes }) => {
  return (
    <div className="w-full bg-white rounded shadow p-2 flex flex-col items-center">
      {/* Wrap image and plus icon in relative container */}
      <div className="w-full h-24 bg-gray-100 rounded mb-2 overflow-hidden relative group">
        {product ? (
          <img
            src={product.image.url}
            alt={product.image.alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex justify-center items-center h-full text-gray-400">
            <span>🛒</span>
          </div>
        )}

        {/* Plus icon positioned absolute and hidden by default */}
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 cursor-pointer group-hover:opacity-100 transition-opacity">
          <Plus size={60} className="text-white" />
        </div>
      </div>

      <span className="text-sm font-semibold">{product.name}</span>
      <div className="flex items-center gap-1 text-xs text-gray-700 mt-1">
        <span>Rs {product.price.toFixed(2)}</span>
        <Info size={12} />
      </div>
    </div>
  );
};

export default ProductCard;
