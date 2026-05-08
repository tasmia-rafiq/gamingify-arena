import HeroSection from "../components/home/HeroSection";
import LatestSection from "../components/home/LatestSection";
import CategorySection from "../components/home/CategorySection";
import { useHomeFeed } from "../hooks/useHomeFeed";

const CATEGORY_SECTIONS = [
  { title: "Tips & Guides", slug: "tips-and-guides", dataKey: "tips" },
  { title: "Reviews", slug: "reviews", dataKey: "reviews" },
  { title: "News", slug: "news", dataKey: "news" },
];

const Home = () => {
  const { data, isLoading, isError } = useHomeFeed();

  if (isError) {
    return (
      <div className="text-center py-20 text-red-400">
        <p className="text-xl">Failed to load homepage content.</p>
        <p className="text-sm text-slate-400 mt-2">
          Please refresh the page or try again later.
        </p>
      </div>
    );
  }
  return (
    <>
      <HeroSection />
      <LatestSection posts={data?.latest} isLoading={isLoading} />

      {CATEGORY_SECTIONS.map(({ title, slug, dataKey }) => (
        <CategorySection
        key={slug}
          title={title}
          slug={slug}
          posts={data?.[dataKey]}
          isLoading={isLoading}
        />
      ))}
    </>
  );
};

export default Home;
