import PostCard from "../components/posts/PostCard";
import PostCategory from "../components/posts/PostCategory";
import PostList from "../components/posts/PostList";
import AppLoader from "../components/ui/AppLoader";
import { usePosts } from "../hooks/usePosts";

const CategoryPage = ({ category, title }) => {
  const { data, isLoading, isError } = usePosts({ category });

  if (isError)
    return (
      <div className="text-center py-20 text-red-400">
        <p className="text-xl">Failed to load posts for {title}.</p>
      </div>
    );

  if (isLoading) return <AppLoader />;

  const posts = data?.data || [];

  return (
    <section className="w-[95%] mx-auto py-8">
      <PostCategory
        name={title}
        tagline={
          title === "News"
            ? "Stay Updated with the Latest Gaming News, Releases, and Developments!"
            : title === "Reviews"
              ? "Explore our Reviews of the Newest Games, Consoles, Keyboards, Controllers, and More!"
              : title === "Tips & Guides"
                ? "Level Up Your Gameplay: Expert Guides"
                : ""
        }
      />

      <div>
        <div className="category_post_grid">
          {posts.slice(0, 4).map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {posts.length > 4 && (
          <PostList posts={posts.slice(4)} isLoading={isLoading} />
        )}
      </div>
    </section>
  );
};

export default CategoryPage;
