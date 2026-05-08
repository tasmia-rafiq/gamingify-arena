import PostSkeleton from "../posts/PostSkeleton";
import { usePosts } from "../../hooks/usePosts";
import SidebarPostCard from "../posts/SidebarPostCard";

const Sidebar = () => {
  // Fetch most popular gaming posts (sorted by viewCount)
  const {
    data: popularData,
    isLoading: isLoadingPopular,
  } = usePosts({ category: "tips-and-guides", sort: "popular", limit: 4 });

  // Fetch trending now gaming posts (most recent)
  const {
    data: trendingData,
    isLoading: isLoadingTrending,
  } = usePosts({ category: "reviews", sort: "latest", limit: 3 });

  const popularPosts = popularData?.data || [];
  const trendingPosts = trendingData?.data || [];

  return (
    <aside className="flex lg:flex-col sm:flex-row flex-col p-4 gap-6 max-lg:mt-8 max-lg:pt-8 max-lg:border-t max-lg:border-primary/70">
      <section>
        <h3 className="text-xl mb-3 uppercase blue_gradient font-medium">Most Popular</h3>
        <div className="flex flex-col gap-4">
          {isLoadingPopular
            ? Array.from({ length: 3 }).map((_, i) => (
                <PostSkeleton key={i} />
              ))
            : popularPosts.map((post) => (
                <SidebarPostCard key={post._id} post={post} />
              ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl mb-3 uppercase blue_gradient font-medium">Trending Now</h3>
        <div className="flex flex-col gap-4">
          {isLoadingTrending
            ? Array.from({ length: 3 }).map((_, i) => (
                <PostSkeleton key={i} />
              ))
            : trendingPosts.map((post) => (
                <SidebarPostCard key={post._id} post={post} />
              ))}
        </div>
      </section>
    </aside>
  );
};

export default Sidebar;