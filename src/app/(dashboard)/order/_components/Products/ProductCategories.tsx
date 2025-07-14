import ProductCard from "./ProductCard";

type ProductCategoryProps = {
  name: string;
  products: {
    name: string;
    price: number;
    img: string;
  }[];
};

const ProductCategory = ({ name, products }: ProductCategoryProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.map((p) => (
          <ProductCard key={p.name} product={p} />
        ))}
      </div>
    </div>
  );
};

export default ProductCategory;
