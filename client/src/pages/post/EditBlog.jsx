import { useParams } from "react-router-dom";
import BlogForm from "../../components/submit/BlogForm";
import BlogGuidelines from "../../components/submit/BlogGuidelines";
import { usePost } from "../../hooks/usePost";
import AppLoader from "../../components/ui/AppLoader";

const EditBlog = () => {
  const { slug } = useParams();
  const { data, isLoading } = usePost(slug);

  if (isLoading) return <AppLoader />;
  return (
    <div className="w-[90%] mx-auto py-12 grid lg:grid-cols-[70%_30%] gap-10">
      <BlogForm initialData={data} isEdit={true} />
      <BlogGuidelines />
    </div>
  );
};

export default EditBlog;
