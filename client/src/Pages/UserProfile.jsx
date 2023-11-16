import React, { useEffect, useState } from "react";
import Profile from "../Components/Profile";
import Loader from "../Components/Loader";
import { useParams } from "react-router";
import useFetchUserPosts from "../Hooks/useFetchUserPosts";

const UserProfile = ({ isCurrentUser }) => {
  const [userID, setUserID] = useState(null);
  const { authorID } = useParams();

  useEffect(() => {
    if (isCurrentUser) {
      const fetchUserID = async () => {
        try {
          const response = await fetch("http:localhost:4000/api/profile", {
            method: "GET",
            credentials: "include",
          });
          const data = await response.json();
          setUserID(data.id);
        } catch (error) {
          console.error("Error fetching user ID:", error);
        }
      };

      fetchUserID();
    }
  }, [isCurrentUser]);

  const url = isCurrentUser
    ? `http:localhost:4000/api/${userID}/userPosts`
    : `http:localhost:4000/api/profile/${authorID}`;

  const { posts, loading } = useFetchUserPosts(url);

  if (loading) {
    return <Loader /> ;
  }

  return (
    <Profile
      name={isCurrentUser ? "My" : `${posts[0]?.author?.username}'s`}
      desc="Posts"
      data={posts}
    />
  );
};

export default UserProfile;
