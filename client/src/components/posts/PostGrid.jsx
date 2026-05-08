import PostCard from "./PostCard";
import PostSkeleton from "./PostSkeleton";

const PostGrid = ({ posts, isLoading, sidebar }) => {
  return (
    <div className="grid lg:grid-cols-[70%_30%] items-start gap-5 relative">
      <div className="grid grid-cols-1 gap-5">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <PostSkeleton key={i} />)
          : posts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>

      {sidebar && (
        <div className="hidden lg:block sticky top-26">{sidebar}</div>
      )}
    </div>
  );
};

export default PostGrid;
