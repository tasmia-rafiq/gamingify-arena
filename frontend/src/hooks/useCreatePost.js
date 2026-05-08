import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/post.api";
import { toast } from "react-toastify";

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createPost,
    onSuccess: (response) => {
      const { message, post } = response.data;
      toast.success(message || "Blog published successfully!");
      
      // Invalidating both "posts" and "home-feed" so both listing pages and the homepage reflect the new post without a manual refresh
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["home-feed"] });

      navigate(`/${post.slug}`);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "Failed to submit blog. Please try again.";
      toast.error(message);
    },
  });
};
