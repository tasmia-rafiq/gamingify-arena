import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import DisplayDate from "./DisplayDate";

const PostCard = ({ post }) => {
  const {
    _id,
    title,
    slug,
    summary,
    categories,
    coverImage,
    author,
    createdAt,
  } = post;
  const { user } = useAuthContext();
  return (
    <div className="post">
      <div className="post_in">
        <div className="image">
          <Link to={`/${slug}`}>
            <img src={coverImage} alt={title} loading="lazy" />
          </Link>
        </div>

        <div className="max-sm:px-4">
          <div className="flex items-center justify-start gap-2">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/${cat.slug}`}
                className="category"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <Link to={`/${slug}`}>
            <h2 className="m-0 sm:text-2xl text-lg font-semibold sm:leading-7 leading-tight pb-2.5 inline-block custom_transition relative before:absolute before:content-[''] hover:text-primary before:bottom-0 before:left-0 before:right-0 before:bg-primary before:w-0 before:h-0.5 hover:before:w-[70%] before:transition-all before:duration-300">
              {title}
            </h2>
          </Link>

          <p className="my-2.5 text-[#ccc] text-sm font-normal items-center flex gap-2">
            <Link
              to={
                user?._id === author._id ? `/profile` : `/author/${author.username}`
              }
              className="text-primary"
            >
              {author.username}
            </Link>
            <span>•</span>
            <time>
              <DisplayDate createdAt={createdAt} />
              {/* {format(new Date(createdAt), "MMM d, yyyy . KK:mm aaa")} */}
            </time>
          </p>
          <p className="my-2 sm:text-base text-sm font-light leading-5 line-clamp-2">{summary}</p>

          <Link to={`/${slug}`} className="inline-block items-center mt-3 read-more_btn">
            <span className="read_more_btn_line"></span>
            <span className="read_more_btn">Read More</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
