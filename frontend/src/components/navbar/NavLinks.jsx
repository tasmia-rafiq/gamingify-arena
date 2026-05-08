import { NavLink } from "react-router-dom";
import { categories } from "../../constants";

const NavLinks = () => {
  const activeClass = ({ isActive }) =>
    isActive ? "text-primary" : "text-white";

  return (
    <nav className="hidden md:flex gap-4">
      <NavLink to="/" className={activeClass}>
        Home
      </NavLink>

      <NavLink to="/latest" className={activeClass}>
        Latest
      </NavLink>

      {categories?.map((cat) => (
        <NavLink
          key={cat.slug}
          to={`/${cat.slug}`}
          className={activeClass}
        >
          {cat.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default NavLinks;