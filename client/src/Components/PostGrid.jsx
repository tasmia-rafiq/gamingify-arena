import SkeletonPost from "./Skeleton";
import Post from "./Post";
import Sidebar from "./Sidebar";

const PostGrid = ({ posts, isLoading }) => {
  return (
    <div className="post_grid_layout">
      <div className="post_grid">
        {isLoading ? (
          <>
            <SkeletonPost />
            <SkeletonPost />
          </>
        ) : (
          posts.length > 0 &&
          posts.map((post) => (
            <Post
              key={post._id}
              {...post}
              category={post.category}
              isLoading={false}
            />
          ))
        )}
      </div>

      <Sidebar />
    </div>
  );
};

export default PostGrid;
