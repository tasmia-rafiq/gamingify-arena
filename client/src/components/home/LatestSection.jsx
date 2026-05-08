import PostGrid from "../posts/PostGrid";
import PostSkeleton from "../posts/PostSkeleton";
import SectionTitle from "./SectionTitle";
import Sidebar from "./Sidebar";

const LatestSection = ({ posts, isLoading }) => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const page = Number(searchParams.get("page")) || 1;
  return (
    <section className="w-[90%] mx-auto mt-12">
      <SectionTitle title="Latests" slug="latest" />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 mt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <PostGrid posts={posts} sidebar={<Sidebar />} />
      ) : (
        <p className="mt-6 text-slate-500">No blogs available.</p>
      )}
    </section>
  );
};

export default LatestSection;
