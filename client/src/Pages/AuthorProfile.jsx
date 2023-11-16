import React, { useEffect, useState } from "react";
import Profile from "../Components/Profile";
import { useParams } from "react-router";

const AuthorProfile = () => {
  const [posts, setPosts] = useState([]);

  const {authorID} = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `http:localhost:4000/api/profile/${authorID}`,
          {
            method: "GET",
            credentials: "include", // Include cookies in the request
          }
        );
        const userPosts = await response.json(); // Parse the response as JSON
        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [authorID]);

  console.log(posts);

  return (
    <Profile
      name={posts[0]?.author?.username}
      desc="Posts"
      data={posts}
    />
  );
};

export default AuthorProfile;
