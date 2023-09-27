import { useState, useEffect } from "react";

const CategoryDropdown = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:4000/category");
        if (response.ok) {
          const categoriesData = await response.json();
          setCategories(categoriesData);
        } else {
          console.error("Error fetching categories:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <div className="category-dropdown">
      <div className="category-input" onClick={() => setShowDropdown(!showDropdown)}>
        {selectedCategory || "Select a Category"}
      </div>
      {showDropdown && (
        <div className="category-options">
          {categories.map((category) => (
            <div
              key={category._id}
              className="category-option"
              onClick={() => {
                setSelectedCategory(category.category_title);
                setShowDropdown(false);
              }}
            >
              {category.category_title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
