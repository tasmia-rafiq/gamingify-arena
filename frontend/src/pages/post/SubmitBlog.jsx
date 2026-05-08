import BlogForm from "../../components/submit/BlogForm";
import BlogGuidelines from "../../components/submit/BlogGuidelines";

const SubmitBlog = () => {
  return (
    <div className="w-[90%] mx-auto py-12 grid lg:grid-cols-[70%_30%] gap-10">
      <BlogForm />
      <BlogGuidelines />
    </div>
  );
};

export default SubmitBlog;