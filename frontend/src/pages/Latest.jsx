import { useSearchParams } from "react-router-dom";
import PostCategory from "../components/posts/PostCategory";
import PostList from "../components/posts/PostList";
import { usePosts } from "../hooks/usePosts";
import PostSkeleton from "../components/posts/PostSkeleton";

const Latest = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  const { data, isLoading, isError } = usePosts({
    page,
    limit: 5,
  });

  if (isError) {
    return (
      <div className="text-center py-20 text-red-400">
        <p className="text-xl">Failed to load latest blogs.</p>
        <p className="text-sm text-slate-400 mt-2">
          Please refresh the page or try again later.
        </p>
      </div>
    );
  }

  return (
    <section className="w-[95%] mx-auto">
      <PostCategory
        name="Latest"
        tagline="View Latest Gaming News, Reviews, Tips and more."
      />

      <div className="my-10">
        {isLoading && (
          <div>
            {Array.from({ length: 6 }).map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        )}

        {data?.data?.length > 0 && (
          <PostList
            posts={data?.data || []}
            meta={data?.meta}
            isLoading={isLoading}
            onPageChange={(newPage) => setSearchParams({ page: newPage })}
          />
        )}
      </div>
    </section>
  );
};

export default Latest;
