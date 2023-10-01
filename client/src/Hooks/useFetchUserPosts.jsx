import { useEffect, useState } from "react";

const useFetchUserPosts = (url) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });
        const userPosts = await response.json();
        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [url]);

  return { posts, loading };
};

export default useFetchUserPosts;
