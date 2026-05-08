import { useQuery } from "@tanstack/react-query";
import { fetchPostBySlug } from "../api/post.api";

export const usePost = (slug) => {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data } = await fetchPostBySlug(slug);
      return data.data;
    },
    // dont fetch if slug is undefind
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // not retrying on 404 — the post genuinely doesn't exist
      if (error?.response?.status === 404) return false;
      return failureCount < 1;
    },
  });
};
