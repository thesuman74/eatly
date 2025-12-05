import { useAdminProductStore } from "@/stores/admin-product-store";
import { useQuery } from "@tanstack/react-query";

export const useFetchProducts = (categoryId: string) => {
  const setProducts = useAdminProductStore((state) => state.setProducts);

  return useQuery({
    queryKey: ["products", categoryId],
    queryFn: getProducts,
    onSuccess: (data) => {
      setProducts(data);
    },
    staleTime: 1000 * 60, // 1 minute
  });
};
