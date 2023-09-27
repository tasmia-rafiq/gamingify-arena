import HeroSection from "../Components/HeroSection";
import PostGrid from "../Components/PostGrid";

const HomePage = () => {
  return (
    <>
      <HeroSection />

      <div className="post_section" id="explore">
        <h2 className="head_title blue_gradient">Recent Posts</h2>

        <PostGrid />
      </div>
    </>
  );
};

export default HomePage;
