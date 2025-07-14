import { Search } from "lucide-react";

const ProductSearch = () => {
  return (
    <div className="flex items-center border border-gray-300 rounded px-2 py-1 w-72">
      <Search size={16} className="text-gray-500" />
      <input
        type="text"
        placeholder="Search product"
        className="flex-1 ml-2 outline-none text-sm"
      />
    </div>
  );
};

export default ProductSearch;
