import React, { useEffect, useState } from "react";
import PostCategory from "../Components/PostCategory";
import Post from "../Components/Post";
import PostGrid from "../Components/PostGrid";

const LatestPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch("https://gamingify-arena-api.vercel.app/api/post");
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
          setIsLoading(false);
        } else {
          console.error("Error fetching Posts:", response.statusText);
        }
      } catch (error) {
        console.log("Internal Server Error", error);
      }
    };

    fetchAllPosts();
  }, []);

  return (
    <div className="post-page" id="latest-page">
      <PostCategory
        pageTitle="Latest"
        categoryTag="View Latest Gaming News, Reviews, Tips and more."
      />

      <PostGrid posts={posts} isLoading={isLoading} />
    </div>
  );
};

export default LatestPage;
