import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Editor from "../Components/Editor";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [categories, setCategories] = useState([]); // for fetching categories from category table
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://gamingify-arena.vercel.app/api/category");
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
  }, []);

  async function createNewPost(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("category", selectedCategory);
    data.set("content", content);
    data.set("file", files[0]);

    const response = await fetch("https://gamingify-arena.vercel.app/api/post", {
      method: "POST",
      body: data,
      credentials: "include", // sending cookie
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form onSubmit={createNewPost} className="form">
      <h1 className="head_title blue_gradient">Create Post</h1>
      <input
        type="title"
        placeholder={"Title"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="summary"
        placeholder={"Summary"}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />

      <div className="category-dropdown">
        <div
          className="category-input"
          onClick={() => setShowDropdown(!showDropdown)}
        >
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

      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />

      <Editor value={content} onChange={setContent} />

      <button style={{ marginTop: "5px" }}>Create Post</button>
    </form>
  );
};

export default CreatePost;
