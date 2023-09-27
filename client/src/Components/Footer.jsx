import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Footer = ({ logo }) => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories
    fetch("http://localhost:4000/category")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  return (
    <footer>
      <Link className="logo col" to={"/"}>
        <img src={logo} alt="LOGO" />
      </Link>

      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/latest">Latest</Link>
        </li>

        {categories.map((category) => (
          <li>
            <Link
              to={`/${category._id}/posts`}
              key={category._id}
              onClick={() => navigate(`/${category._id}/posts`)}
            >
              {category.category_title}
            </Link>
          </li>
        ))}
      </ul>

      <p className="copyright">&copy; 2023 Gamingify Arena | All rights reserverd.</p>
    </footer>
  );
};

export default Footer;
