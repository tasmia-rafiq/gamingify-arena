import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import DisplayDate from "./DisplayDate";

const PostShortCard = ({ post }) => {
  const { title, slug, coverImage, author, createdAt } = post;
  const { user } = useAuthContext();
  return (
    <div className="flex flex-col gap-4">
      <Link to={`/${slug}`}>
        <figure className="bg-bg">
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            className="aspect-video w-full h-45 object-cover custom-transition hover:opacity-80"
            sizes="calc(100vw - 2rem), (min-width: 640px) calc(50vw - 1.75rem), (min-width: 1024px) calc(25vw - 1.625rem), (min-width: 1280px) 296px"
          />
        </figure>
      </Link>

      <div>
        <Link to={`/${slug}`}>
          <h2 className="m-0 text-[22px] font-semibold leading-7 pb-2 inline-block custom_transition relative before:absolute before:content-[''] hover:text-primary before:bottom-0 before:left-0 before:right-0 before:bg-primary before:w-0 before:h-0.5 hover:before:w-[70%] before:transition-all before:duration-300">
            {title}
          </h2>
        </Link>

        <p className="mt-1.5 text-[#ccc] text-sm font-normal flex items-center gap-2">
          <Link
            to={
              user?._id === author._id
                ? `/profile`
                : `/author/${author.username}`
            }
            className="text-primary"
          >
            {author.fullname}
          </Link>
          <span>•</span>
          <time className="pt-0.5">
            <DisplayDate createdAt={createdAt} />
          </time>
        </p>
      </div>
    </div>
  );
};

export default PostShortCard;
