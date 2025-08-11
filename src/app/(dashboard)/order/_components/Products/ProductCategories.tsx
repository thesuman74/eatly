import { ProductTypes } from "@/lib/types/menu-types";
import ProductCard from "./ProductCard";

type ProductCategoryProps = {
  name: string;
  products: ProductTypes[];
};

const ProductCategory = ({ name, products }: ProductCategoryProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.map((p) => (
          <ProductCard key={p.name} product={p} onAddToCart={() => {}} />
        ))}
      </div>
    </div>
  );
};

export default ProductCategory;
