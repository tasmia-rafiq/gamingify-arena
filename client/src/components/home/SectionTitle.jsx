import { LucideMoveRight } from "lucide-react";
import { Link } from "react-router-dom";

const SectionTitle = ({ title, slug }) => {
  return (
    <div className="flex justify-start items-center gap-4 my-6">
      <h2 className="head_title blue_gradient">{title}</h2>
      <span className="text-xl">•</span>
      <Link
        to={`/${slug}`}
        className="flex gap-2 items-center text-white hover:text-primary text-lg font-medium mt-1 custom-transition"
      >
        View All <LucideMoveRight />
      </Link>
    </div>
  );
};

export default SectionTitle;
