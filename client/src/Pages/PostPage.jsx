import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import PostCategory from "../Components/PostCategory";
import Sidebar from "../Components/Sidebar";

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const [deleted, setDeleted] = useState(false);

  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  const [categoryTitle, setCategoryTitle] = useState("");

  useEffect(() => {
    const fetchCategoryTitle = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/category/${postInfo.category._id}`
        );
        const data = await response.json();
        setCategoryTitle(data);
      } catch (error) {
        console.error("Error fetching category title:", error);
      }
    };

    fetchCategoryTitle();
  }, [postInfo?.category?._id]);

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, []);

  // delete post function
  const deletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:4000/post/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
      });

      if (response.ok) {
        setDeleted(true);
      } else {
        const data = await response.json();
        console.error(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete) {
      deletePost(postInfo._id);
    }
  };

  if (deleted) return <Navigate to="/" />;

  if (!postInfo) return "";

  return (
    <div className="post-page">
      <PostCategory categoryTitle={categoryTitle} />
      <h1 className="post_title">{postInfo.title}</h1>
      <p className="post_summary">~ {postInfo.summary}</p>
      <div className="author">By <Link to={userInfo.id === postInfo.author._id  ? `/profile` : `/profile/${postInfo.author._id}`}>@{postInfo.author.username}</Link></div>
      <time>
        Published {format(new Date(postInfo.createdAt), "MMM d, yyyy . KK:mm aaa")}
      </time>
      {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link to={`/edit/${postInfo._id}`} className="edit-btn">
            <FaRegEdit className="post_page_icon" />
            Edit this Post
          </Link>

          <button onClick={handleDelete} className="delete-btn">
            <RiDeleteBin5Line className="post_page_icon" />
            Delete Post
          </button>
        </div>
      )}

      <div className="post_grid_layout">
        {/* LEFT SIDE */}
        <div className="left_side">
          <div className="image">
            <img
              src={`http://localhost:4000/${postInfo.coverImg}`}
              alt="Cover"
            />
          </div>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: postInfo.content }}
          />
        </div>

        {/* RIGHT SIDE */}
        <Sidebar />
      </div>
    </div>
  );
};

export default PostPage;
