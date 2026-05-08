import Sidebar from "../home/Sidebar";
import Pagination from "./Pagination";
import PostCard from "./PostCard";
import PostSkeleton from "./PostSkeleton";

const PostList = ({ posts, meta, isLoading, onPageChange }) => {
  return (
    <div className="grid lg:grid-cols-[70%_30%] gap-5 items-start relative">
      <div className="grid grid-cols-1 gap-5">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <PostSkeleton key={i} />)
          : posts.map((post) => <PostCard key={post._id} post={post} />)}

        {meta?.totalPages > 1 && (
          <Pagination
            currentPage={meta?.page}
            totalPages={meta?.totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>

      <Sidebar />
    </div>
  );
};

export default PostList;
