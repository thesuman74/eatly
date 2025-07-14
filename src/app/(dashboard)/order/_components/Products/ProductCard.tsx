import { Info } from "lucide-react";

type ProductCardProps = {
  product: {
    name: string;
    price: number;
    img: string;
  };
};

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="w-full bg-white rounded shadow p-2 flex flex-col items-center">
      <div className="w-full h-24 bg-gray-100 rounded mb-2 overflow-hidden">
        {product.img ? (
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex justify-center items-center h-full text-gray-400">
            <span>🛒</span>
          </div>
        )}
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
