import { Link } from "react-router-dom";
import DisplayDate from "./DisplayDate";

const SidebarPostCard = ({ post }) => {
  const { title, slug, coverImage, createdAt } = post;
  return (
    <div className="flex lg:flex-row-reverse gap-4 pb-4 border-b border-primary/30 last:border-0">
      <Link to={`/${slug}`}>
        <figure className="bg-bg">
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            className="lg:w-80 lg:h-fit lg:aspect-auto aspect-square w-20 h-full object-cover custom-transition hover:opacity-80"
          />
        </figure>
      </Link>

      <div>
        <Link to={`/${slug}`}>
          <h2 className="m-0 text-base font-medium leading-tight pb-2 inline-block custom_transition hover:text-primary">
            {title}
          </h2>
        </Link>

        <p className="text-[#ccc] text-sm font-normal flex items-center gap-2">
          <time className="pt-0.5">
            <DisplayDate createdAt={createdAt} />
          </time>
        </p>
      </div>
    </div>
  );
};

export default SidebarPostCard