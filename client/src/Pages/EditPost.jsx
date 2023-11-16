import { useEffect, useState } from "react";
import Editor from "../Components/Editor";
import { Navigate, useParams } from "react-router";

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetch("https://gamingify-arena-api.vercel.app/api/post/" + id).then((response) => {
      response.json().then((postInfo) => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
        setSelectedCategory(postInfo.category._id);
      });
    });
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://gamingify-arena-api.vercel.app/api/category");
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

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("category", selectedCategory);
    data.set("content", content);
    data.set("id", id);
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }

    const response = await fetch("https://gamingify-arena-api.vercel.app/api/post", {
      method: "PUT",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  return (
    <form onSubmit={updatePost} className="form">
      <h1 className="head_title blue_gradient">Edit Post</h1>
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
          {categories.find((cat) => cat._id === selectedCategory)?.category_title || "Select a Category"}
        </div>
        {showDropdown && (
          <div className="category-options">
            {categories.map((cat, index) => (
              <div
                className="category-option"
                key={index}
                onClick={() => {
                  setSelectedCategory(cat._id);
                  setShowDropdown(false);
                }}
              >
                {cat.category_title}
              </div>
            ))}
          </div>
        )}
      </div>

      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />

      <Editor onChange={setContent} value={content} />

      <button style={{ marginTop: "5px" }}>Update Post</button>
    </form>
  );
};

export default EditPost;
