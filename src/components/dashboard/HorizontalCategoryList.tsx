import React from "react";

type Category = {
  id: string;
  name: string;
};

interface Props {
  categories: Category[];
}

export default function HorizontalCategoryList({ categories }: Props) {
  return (
    <div className=" w-full max-w-full overflow-hidden my-2">
      <div
        className="
          flex
          gap-3
          overflow-x-auto
          overscroll-x-contain
          px-2
          py-1
          w-full
          max-w-full
        "
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        {categories.length > 0 &&
          categories.map((category, index) => (
            <div
              key={category.id + index}
              className="
              flex-shrink-0
              whitespace-nowrap
              rounded-md
              bg-secondary
              px-3
              py-1
              text-sm
              font-medium
              hover:bg-gray-200
            "
            >
              {category.name}
            </div>
          ))}
      </div>
    </div>
  );
}
