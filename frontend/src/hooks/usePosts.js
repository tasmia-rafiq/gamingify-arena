import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api/post.api";

export const usePosts = (params) => {
    return useQuery({
        queryKey: ["posts", params],
        queryFn: async () => {
            const { data } = await fetchPosts(params);
            return data;
        },
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
};