import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    const fetchCategoryTitle = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/category/${category}`
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
            <img
              src={"http://localhost:4000/" + coverImg}
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
            <a className="author">{author.username}</a>
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
