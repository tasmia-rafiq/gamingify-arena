import SkeletonPost from "./Skeleton";
import Post from "./Post";
import Sidebar from "./Sidebar";
import Pagination from "./Pagination";
import { useState } from "react";

const PostGrid = ({ posts, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="post_grid_layout">
      <div className="post_grid">
        {isLoading ? (
          <>
            <SkeletonPost />
            <SkeletonPost />
          </>
        ) : (
          currentPosts.length > 0 &&
          currentPosts.map((post) => (
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

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(posts.length / postsPerPage)}
        onPageChange={paginate}
      />
    </div>
  );
};

export default PostGrid;
