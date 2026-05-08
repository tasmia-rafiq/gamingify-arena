import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { updatePost } from "../api/post.api";
import { toast } from "react-toastify";

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ slug, formData }) => updatePost(slug, formData),

    onSuccess: (data) => {
      toast.success("Blog updated successfully ✨");
      queryClient.invalidateQueries(["posts"]);
      navigate(`/${data.data.post.slug}`);
    },

    onError: () => {
      toast.error("Failed to update blog.");
    },
  });
};