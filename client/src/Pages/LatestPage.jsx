import React, { useEffect, useState } from "react";
import PostCategory from "../Components/PostCategory";
import Post from "../Components/Post";

const LatestPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch("http://localhost:4000/post");
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          console.error("Error fetching Posts:", response.statusText);
        }
      } catch (error) {
        console.log('Internal Server Error', error);
      }
    };

    fetchAllPosts();
  }, []);

  return (
    <div className="post-page" id="latest-page">
      <PostCategory pageTitle='Latest' categoryTag="View Latest Gaming News, Reviews, Tips and more." />

      <div className="post_grid" style={{ marginTop: "4rem" }}>
        {posts.map((post) => (
          <Post key={post._id} {...post} category={post.category} />
        ))}
      </div>
    </div>
  );
};

export default LatestPage;
