import { adminCategoryStore } from "@/stores/admin/adminCategoryStore";
import { useQuery } from "@tanstack/react-query";

const getCategories = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/menu/structured`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

export const useFetchCategories = () => {
  const setCategories = adminCategoryStore((state) => state.setCategories);

  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,

    staleTime: 1000 * 60, // 1 minute
  });
};
