import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserProfile, followUser, unfollowUser } from "../api/user.api";

export const useUserProfile = (id) => {
  const queryClient = useQueryClient();

  const q = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data } = await fetchUserProfile(id);
      return data.data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const followMutate = useMutation({
    mutationFn: (userId) => followUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries(["user", userId]);
    },
  });

  const unfollowMutate = useMutation({
    mutationFn: (userId) => unfollowUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries(["user", userId]);
    },
  });

  return { ...q, followMutate, unfollowMutate };
};
