// "use client";

// import {
//   SortableContext,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import SubItem from "./SubItem";
// import { ProductTypes } from "@/lib/types/menu-types";
// import { useState } from "react";

// interface SubItemListProps {
//   initialProducts: ProductTypes[];
//   onDelete: (id: string) => void;
//   onDuplicate: (id: string) => void;
//   onToggleVisibility: (id: string) => void;
// }

// const SubItemList = ({
//   initialProducts,
//   onDelete,
//   onDuplicate,
//   onToggleVisibility,
// }: SubItemListProps) => {
//   return (
//     <SortableContext
//       items={initialProducts}
//       strategy={verticalListSortingStrategy}
//     >
//       <div className="ml-6 mt-2">
//         {initialProducts?.map((item) => (
//           <SubItem
//             key={item.id}
//             item={item}
//             onDelete={onDelete}
//             onDuplicate={onDuplicate}
//             onToggleVisibility={onToggleVisibility}
//           />
//         ))}
//       </div>
//     </SortableContext>
//   );
// };

// export default SubItemList;
"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SubItem from "./SubItem";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProductsAPI,
  deleteProductAPI,
  duplicateProductAPI,
  toggleProductVisibilityAPI,
} from "@/services/productServices";
import { toast } from "react-toastify";
import { ProductTypes } from "@/lib/types/menu-types";
import { useProductSheet } from "@/stores/ui/productSheetStore";
import { useProductActions } from "@/hooks/products/useProductActions";

interface SubItemListProps {
  products: ProductTypes[];
  categoryID: string;
}

const SubItemList = ({ products, categoryID }: SubItemListProps) => {
  const queryClient = useQueryClient();

  const { deleteMutation, duplicateMutation, toggleVisibilityMutation } =
    useProductActions();

  // to do :: check for resturant id in duplicate and togglevisibility

  // if (isLoading) return <div>Loading products...</div>;

  return (
    <SortableContext items={products} strategy={verticalListSortingStrategy}>
      <div className="ml-6 mt-2">
        {products?.map((item: any) => (
          <SubItem
            key={item.id}
            item={item}
            onDelete={() => deleteMutation.mutate(item.id)}
            onDuplicate={() => duplicateMutation.mutate(item.id)}
            onToggleVisibility={() => toggleVisibilityMutation.mutate(item.id)}
            categoryID={categoryID}
          />
        ))}
      </div>
    </SortableContext>
  );
};

export default SubItemList;
