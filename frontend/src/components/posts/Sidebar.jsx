import { Link } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";

// newsletter
const NewsletterWidget = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="py-3 pr-5">
        Sign up for our Newsletter for breaking news and a daily roundup of the
        world of gaming.
      </p>
      <div className="flex items-center justify-center gap-2">
        <input
          type="email"
          placeholder="Enter Email Address"
          aria-label="Email address for newsletter"
          required
          className="block w-full h-12 py-2.5 px-5 text-white border border-white/15 bg-black/25 rounded-xl text-sm"
        />
        <button type="submit" className="h-fit! btn-primary w-fit! text-sm!">Subscribe</button>
      </div>
    </form>
  );
};

// categories widget
const CategoriesWidget = () => {
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading) {
    return (
      <div className="feature_content">
        {[1, 2, 3].map((n) => (
          <div key={n} className="category_skeleton" aria-hidden="true" />
        ))}
      </div>
    );
  }

  if (isError || !categories?.length) {
    return (
      <div className="feature_content">
        <p className="sidebar_error">Categories unavailable.</p>
      </div>
    );
  }

  return (
    <div className="feature_content">
      {categories.map((category) => (
        <Link key={category._id} to={`/category/${category.slug}`} className="flex flex-col items-start w-fit font-normal text-lg pb-2 custom-transition hover:text-primary">
          {category.name}
        </Link>
      ))}
    </div>
  );
};

// Sidebar
const SIDEBAR_SECTIONS = [
  { id: "categories", title: "Categories" },
  { id: "newsletter", title: "Gamingify Newsletter" },
];

const Sidebar = () => {
  return (
    <aside className="p-6 flex flex-col gap-8 sticky top-24 self-start h-fit max-h-[calc(100vh - 40px)]" aria-label="Sidebar">
      {SIDEBAR_SECTIONS.map(({ id, title }) => (
        <div className="bg-black/50 p-6 rounded-lg border border-white/15 shadow-lg" key={id}>
          <h2 className="inline-block font-semibold border-b-2 border-primary mb-6 pb-1 blue_gradient">{title}</h2>
          {id === "categories" ? <CategoriesWidget /> : <NewsletterWidget />}
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
