import { useState } from "react";
import { useDeletePost } from "../../hooks/useDeletePost";
import { Trash2 } from "lucide-react";

const DeletePostButton = ({ slug }) => {
  const { mutate: deletePost, isPending } = useDeletePost();
  const [confirming, setConfirming] = useState(false);

  const handleFirstClick = () => setConfirming(true);

  const handleConfirm = () => {
    deletePost(slug);
    setConfirming(false);
  };

  const handleCancel = () => setConfirming(false);

  if (confirming) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        role="alert"
      >
        <div className="bg-bg w-2xl h-[60vh] flex flex-col items-center justify-center gap-8 p-8 rounded-lg text-center">
          <span className="head_title blue_gradient">
            Are you sure you want to delete this post?
          </span>

          <div className="flex items-center gap-4 w-full max-w-md">
            <button
              onClick={handleConfirm}
              disabled={isPending}
              className="btn-primary"
              aria-label="Confirm delete"
            >
              {isPending ? "Deleting..." : "Yes, delete"}
            </button>
            <button
              onClick={handleCancel}
              className="btn-primary bg-white"
              aria-label="Cancel delete"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleFirstClick}
      className="delete_btn"
      disabled={isPending}
      aria-label="Delete this post"
    >
      Delete
      <Trash2 className="size-4.5" aria-hidden="true" />
    </button>
  );
};

export default DeletePostButton;
