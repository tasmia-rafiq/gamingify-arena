import { ArrowUpRight, BadgePlusIcon } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="md:w-[65%] lg:px-16 px-0 space-y-4">
        <h1 className="sm:text-5xl text-4xl font-bold sm:leading-14 leading-tight">
          Level Up Your Gaming Experience with{" "}
          <span className="glowy_text">Gamingify Arena</span>
        </h1>
        <p className="sm:text-[1.8rem] text-xl sm:leading-9 leading-tight mb-6">
          Discover the Hottest Game Releases, In-Depth Reviews, and Expert Tips
        </p>

        <div className="flex sm:flex-row flex-col gap-4">
          <a className="btn-primary w-fit!" href="#explore">
            Start Gamingify Journey <ArrowUpRight />
          </a>
          <a className="btn-primary bg-white! w-fit!" href="/submit-blog">
            Submit Your Blog <BadgePlusIcon />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
