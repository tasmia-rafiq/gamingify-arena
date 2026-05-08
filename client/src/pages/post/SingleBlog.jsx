import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import { useAuthContext } from "../../contexts/AuthContext";
import { usePost } from "../../hooks/usePost";
import PostCategory from "../../components/posts/PostCategory";
import DeletePostButton from "../../components/posts/DeletePostButton";
import Sidebar from "../../components/posts/Sidebar";
import { Edit } from "lucide-react";
import AppLoader from "../../components/ui/AppLoader";
import ErrorNotFound from "../../components/ErrorNotFound";
import { convertYouTubeLinksToEmbed } from "../../utils/embedYoutube";

const SingleBlog = () => {
  const { slug } = useParams();
  const { user, loading: authLoading } = useAuthContext();

  const { data: post, isLoading, isError, error } = usePost(slug);

  if (isLoading) return <AppLoader />;

  if (error?.response?.status === 404) {
    <ErrorNotFound
      desc="This post may have been deleted or the URL is incorrect."
      title="Blog Not Found!"
    />;
  }

  if (isError) {
    return (
      <ErrorNotFound
        title="Something went wrong"
        desc="Failed to load this post. Please try again later."
      />
    );
  }

  if (!post) return null;

  // console.log("[isAuthor debug]", {
  //   "user._id":         user?._id,
  //   "user.id":          user?.id,
  //   "post.author._id":  post.author?._id,
  //   "authLoading":      authLoading,
  //   "typeof user._id":  typeof user?._id,
  //   "typeof author._id":typeof post.author?._id,
  // });

  const userId = user?._id ?? user?.id;
  const authorId = post.author?._id ?? post.author?.id;

  const isAuthor =
    !authLoading &&
    !!userId &&
    !!authorId &&
    String(userId) === String(authorId);

  // First category is used for the decorative label at the top
  const primaryCategory = post.categories?.[0];

  // Sanitise Quill HTML output before rendering (critical XSS protection)
  const cleanedContent = post.content
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " "); // normalize spaces

  const contentWithEmbeds = convertYouTubeLinksToEmbed(cleanedContent);

  const sanitisedContent = DOMPurify.sanitize(contentWithEmbeds, {
    ADD_TAGS: ["iframe", "div"],
    ADD_ATTR: [
      "allow",
      "allowfullscreen",
      "frameborder",
      "src",
      "class",
    ],
  });

  return (
    <article className="px-12 mb-10 post_page">
      {/* Category label */}
      {primaryCategory && (
        <PostCategory name={primaryCategory.name} slug={primaryCategory.slug} />
      )}

      <h1 className="post_title">{post.title}</h1>
      <p className="post_summary">~ {post.summary}</p>

      <div className="flex items-center gap-4 justify-between mb-6">
        <div className="flex flex-col items-start justify-center">
          {/* Author */}
          <div className="post_author">
            By{" "}
            <Link
              to={isAuthor ? "/profile" : `/author/${post.author._id}`}
              aria-label={`View ${post.author.username}'s profile`}
              className="text-primary hover:underline custom-transition"
            >
              @{post.author.username}
            </Link>
          </div>

          {/* Published date */}
          <time dateTime={post.createdAt}>
            Published {format(new Date(post.createdAt), "MMM d, yyyy · h:mm a")}
          </time>
        </div>

        {/* Author-only actions */}
        {isAuthor && (
          <div className="edit_row">
            <Link
              to={`/${post.slug}/edit`}
              className="edit_btn border-r border-white/20 pr-4"
              aria-label="Edit this post"
            >
              Edit
              <Edit className="size-4.5" aria-hidden="true" />
            </Link>

            <DeletePostButton slug={post.slug} />
          </div>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-[7fr_3fr] gap-6 relative mt-12">
        <div className="left_side min-w-0">
          {/* Cover image */}
          <figure className="max-h-150 overflow-hidden mb-8 flex justify-center relative">
            <img
              src={post.coverImage}
              alt={`Cover image for "${post.title}"`}
              loading="lazy"
              className="object-cover object-center w-full z-1"
            />
          </figure>

          {/* Post body — sanitised HTML from Quill */}
          <div
            className="content"
            // DOMPurify.sanitize() strips all XSS vectors before this renders
            dangerouslySetInnerHTML={{ __html: sanitisedContent }}
          />
        </div>

        <Sidebar />
      </div>
    </article>
  );
};

export default SingleBlog;
