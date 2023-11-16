import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const sideBarContent = ["Categories", "Gamingify Newsletter"];

const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // fetching categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catResponse = await fetch("https://gamingify-arena.vercel.app/api/category");
        if (catResponse.ok) {
          const catData = await catResponse.json();
          setCategories(catData);
        } else {
          console.error("Failed to fetch Categories");
        }
      } catch (error) {
        console.log("Internal Server Error: ", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="sidebar">
      {sideBarContent.length > 0 &&
        sideBarContent.map((content, index) => (
          <div className="feature" key={index}>
            <h2 className="feature_title blue_gradient">{content}</h2>

            <div className="feature_content">
              {content === "Categories" ? (
                categories.map((category) => (
                  <Link
                    to={`/${category._id}/posts`}
                    key={category._id}
                    onClick={() => navigate(`/${category._id}/posts`)}
                  >
                    {category.category_title}
                  </Link>
                ))
              ) : (
                <form className="news_letter">
                  <p>
                    Sign up for our Newsletter for breaking news and a daily
                    roundup of the world of gaming
                  </p>
                  <div>
                    <input type="email" placeholder="Enter Email Address" />
                    <button type="submit">Subscribe</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Sidebar;
