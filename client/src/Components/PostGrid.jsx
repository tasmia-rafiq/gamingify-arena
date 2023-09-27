import React, { useEffect, useState } from "react";
import SkeletonPost from "./Skeleton";
import Post from "./Post";
import Sidebar from "./Sidebar";

const PostGrid = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // fetching all posts
  useEffect(() => {
    fetch("http://localhost:4000/post").then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
        setIsLoading(false);
      });
    });
  }, []);

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
