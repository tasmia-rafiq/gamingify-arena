import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import Image from "./Image";

const Post = ({
  _id,
  title,
  summary,
  category,
  coverImg,
  content,
  createdAt,
  author,
}) => {

  const [categoryTitle, setCategoryTitle] = useState("");
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    const fetchCategoryTitle = async () => {
      try {
        const response = await fetch(
          `https://gamingify-arena.vercel.app/api/category/${category}`
        );
        const data = await response.json();
        setCategoryTitle(data);
      } catch (error) {
        console.error("Error fetching category title:", error);
      }
    };

    fetchCategoryTitle();
  }, [category]);

  return (
    <div className="post">
      <div className="post_in">
        <div className="image">
          <Link to={`/post/${_id}`}>
            <Image
              src={coverImg}
              alt="Cover"
              loading="lazy"
            />
          </Link>
        </div>
        <div className="texts">
          <Link to={`/${category}/posts`} className="category">{categoryTitle}</Link>
          <Link to={`/post/${_id}`}>
            <h2>{title}</h2>
          </Link>

          <p className="info">
            <Link to={userInfo.id === author._id  ? `/profile` : `/profile/${author._id}`} className="author">{author.username}</Link>
            <time>
              {format(new Date(createdAt), "MMM d, yyyy . KK:mm aaa")}
            </time>
          </p>
          <p className="summary">{summary}</p>

          <Link to={`/post/${_id}`} className="read_more">
            <span className="btn_line"></span>
            <span className="read_more_btn">Read More</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Post;
