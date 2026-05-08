import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deletePost } from "../api/post.api";
import { toast } from "react-toastify";

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deletePost,

    onSuccess: (_, slug) => {
      toast.success("Post deleted successfully.");

      // removing from cache immediately
      queryClient.removeQueries({ queryKey: ["post", slug] });

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["home-feed"] });
      navigate("/");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "Failed to delete post. Please try again.";
      toast.error(message);
    },
  });
};
