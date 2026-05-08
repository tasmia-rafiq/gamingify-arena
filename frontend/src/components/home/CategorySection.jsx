import PostSkeleton from "../posts/PostSkeleton";
import PostShortCard from "../posts/PostShortCard";
import SectionTitle from "./SectionTitle";

const CategorySection = ({ title, slug, posts, isLoading }) => {
  return (
    <section className="w-[90%] mx-auto mt-12">
      <SectionTitle title={title} slug={slug} />

      {isLoading ? (
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mt-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 mt-6">
          {posts.map((post) => (
            <PostShortCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-slate-500">No posts available.</p>
      )}
    </section>
  );
};

export default CategorySection;
