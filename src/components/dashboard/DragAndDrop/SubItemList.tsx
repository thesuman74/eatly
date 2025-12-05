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
} from "@/services/productServices";

interface SubItemListProps {
  categoryId: string;
}

const SubItemList = ({ categoryId }: SubItemListProps) => {
  const queryClient = useQueryClient();

  // Fetch products using queryKey and queryFn style
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", categoryId],
    queryFn: () => getProductsAPI(categoryId),
    staleTime: 1000 * 60 * 5, // 5 minutes caching
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: (productId: string) => deleteProductAPI(productId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["products", categoryId] }),
  });

  // Duplicate product mutation
  const duplicateMutation = useMutation({
    mutationFn: (productId: string) => duplicateProductAPI(productId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["products", categoryId] }),
  });

  if (isLoading) return <div>Loading products...</div>;

  return (
    <SortableContext items={products} strategy={verticalListSortingStrategy}>
      <div className="ml-6 mt-2">
        {products?.map((item: any) => (
          <SubItem
            key={item.id}
            item={item}
            onDelete={() => deleteMutation.mutate(item.id)}
            onDuplicate={() => duplicateMutation.mutate(item.id)}
            onToggleVisibility={() => {}}
          />
        ))}
      </div>
    </SortableContext>
  );
};

export default SubItemList;
