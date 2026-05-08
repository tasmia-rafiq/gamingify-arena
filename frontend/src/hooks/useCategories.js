import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/category.api";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await fetchCategories();
      return data.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });
};