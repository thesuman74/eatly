type ProductSidebarProps = {
  categories: {
    name: string;
    products: any[];
  }[];
};

const ProductSidebar = ({ categories }: ProductSidebarProps) => {
  return (
    <div className="w-48 border-r border-gray-200 bg-gray-50 p-4">
      <ul className="space-y-2 ">
        {categories.map((cat) => (
          <li
            key={cat.name}
            className="cursor-pointer text-gray-700 border-b py-4 hover:text-blue-600"
          >
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductSidebar;
