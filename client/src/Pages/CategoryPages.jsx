import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { UserContext } from "../UserContext";
import Post from "../Components/Post";
import PostCategory from "../Components/PostCategory";
import Loader from "../Components/Loader";
import PostGrid from "../Components/PostGrid";

const CategoryPages = () => {
  const [categoryTitle, setCategoryTitle] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userInfo } = useContext(UserContext);
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // to fetch category
        const categoryResponse = await fetch(
          `https://gamingify-arena-api.vercel.app/api/category/${categoryId}`
        );
        const categoryData = await categoryResponse.json();
        setCategoryTitle(categoryData);

        // to fetch posts of certain category
        const postResponse = await fetch(
          `https://gamingify-arena-api.vercel.app/api/${categoryId}/posts`
        );

        if (postResponse.ok) {
          const postsData = await postResponse.json();
          console.log("ALl CATPost:", postsData);
          setPosts(postsData);
          setIsLoading(false);
        } else {
          console.error("Error fetching data:", postResponse.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [categoryId]);

  return (
    <div className="post-page" id="category-page">
      <PostCategory
        categoryTitle={categoryTitle}
        categoryTag={
          categoryTitle === "News"
            ? "Stay Updated with the Latest Gaming News, Releases, and Developments!"
            : categoryTitle === "Reviews"
            ? "Explore our Reviews of the Newest Games, Consoles, Keyboards, Controllers, and More!"
            : categoryTitle === "Tips & Guides"
            ? "Level Up Your Gameplay: Expert Guides"
            : ""
        }
      />

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="post_grid category-page" style={{ marginTop: "4rem" }}>
            {posts.slice(0, 4).map((post) => (
              <Post key={post._id} {...post} category={post.category._id} />
            ))}
          </div>

          {posts.length > 4 && (
            <PostGrid posts={posts.slice(4)} isLoading={isLoading} />
          )}
        </>
      )}
    </div>
  );
};

export default CategoryPages;
