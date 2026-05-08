import { useQuery } from "@tanstack/react-query"
import { fetchHomePosts } from "../api/post.api";

export const useHomeFeed = () => {
    return useQuery({
        queryKey: ["home-feed"],
        queryFn: async () => {
            const { data } = await fetchHomePosts();
            return data.data;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
        refetchOnWindowFocus: false,
        retry: 1,
    });
}