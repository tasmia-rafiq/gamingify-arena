import { useEffect, useState } from "react";
import HeroSection from "../Components/HeroSection";
import PostGrid from "../Components/PostGrid";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // fetching all posts
  useEffect(() => {
    fetch("https://gamingify-arena-api.vercel.app/post").then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
        setIsLoading(false);
      });
    });
  }, []);

  return (
    <>
      <HeroSection />

      <div className="post_section" id="explore">
        {/* RECENT POSTS */}
        <h2 className="head_title blue_gradient">Recent Posts</h2>
        <PostGrid posts={posts} isLoading={isLoading} />
      </div>
    </>
  );
};

export default HomePage;
