import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback, useEffect } from "react";
import BlogEditor from "./BlogEditor";
import { editBlogSchema, createBlogSchema } from "../../validation/post.validation";
import { useCategories } from "../../hooks/useCategories";
import { useCreatePost } from "../../hooks/useCreatePost";
import Input from "../ui/Input";
import Button from "../ui/Button";
import TextArea from "../ui/TextArea";
import ImageUploader from "./ImageUploader";
import { useUpdatePost } from "../../hooks/useUpdatePost";

const BlogForm = ({ initialData = null, isEdit = false }) => {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { mutate: createPostMutate, isPending: creating } = useCreatePost();
  const { mutate: updatePostMutate, isPending: updating } = useUpdatePost();
  const [imagePreview, setImagePreview] = useState(null);

  const isSubmitting = creating || updating;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? editBlogSchema : createBlogSchema),
    defaultValues: {
      title: "",
      summary: "",
      categories: "",
      content: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        summary: initialData.summary,
        categories: initialData.categories?.[0]?._id || "",
        content: initialData.content,
      });

      setImagePreview(initialData.coverImage);
    }
  }, [initialData, reset]);

  // memoized handler prevents BlogEditor re-renders on every keystroke in parent form fields
  const handleEditorChange = useCallback(
    (value) => setValue("content", value, { shouldValidate: true }),
    [setValue],
  );

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("summary", data.summary);
    // sending category as array (even for single selected)
    Array.isArray(data.categories)
      ? data.categories.forEach((cat) => formData.append("categories", cat))
      : formData.append("categories", data.categories);
    formData.append("content", data.content);

    if (data.coverImage?.[0]) {
      formData.append("coverImage", data.coverImage[0]);
    }

    if (isEdit) {
      updatePostMutate({
        slug: initialData.slug,
        formData,
      });
    } else {
      createPostMutate(formData, {
        onSuccess: () => {
          reset();
          setImagePreview(null);
        },
      });
    }
  };

  const titleLength = watch("title")?.length ?? 0;
  const summaryLength = watch("summary")?.length ?? 0;

  return (
    <div>
      <div>
        <h1 className="blue_gradient head_title text-left! sm:text-5xl text-4xl mb-4 leading-tight">
          {isEdit ? "Edit Your Gaming Blog" : "Submit Your Gaming Blog"}
        </h1>
        <p className="sm:text-2xl text-xl">
          Share your insights, reviews, guides, and gaming experiences with the
          community.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 auth_form max-w-full!"
        aria-label={isEdit ? "Edit blog post form" : "Submit blog post form"}
        noValidate
      >
        {/* TITLE */}
        <Input
          label="Title *"
          labelClass="text-lg!"
          type="text"
          id="post-title"
          name="title"
          placeholder="Enter a title. (e.g. Here are the Top 10 RPGs You Must Play in 2026)"
          loading={isSubmitting}
          {...register("title")}
          error={errors.title?.message}
          className="ps-4 text-base"
          maxLength={200}
          aria-describedby="title-count"
        >
          <p
            id="title-count"
            className={`text-xs pt-2 ${titleLength >= 200 ? "text-red-400" : titleLength >= 150 ? "text-yellow-300" : "text-slate-400"}`}
          >
            {titleLength}/200 characters
          </p>
        </Input>

        {/* SUMMARY */}
        <TextArea
          label="Summary *"
          labelClass="text-lg!"
          id="post-summary"
          name="summary"
          placeholder="Short description of your article..."
          loading={isSubmitting}
          {...register("summary")}
          className="ps-4 text-base"
          error={errors.summary?.message}
          maxLength={300}
          aria-describedby="summary-count"
        >
          <p
            id="summary-count"
            className={`text-xs ${summaryLength >= 300 ? "text-red-400" : summaryLength >= 250 ? "text-yellow-300" : "text-slate-400"}`}
          >
            {summaryLength}/300 characters
          </p>
        </TextArea>

        {/* CATEGORY */}
        <div>
          <label
            htmlFor="post-category"
            className="block mb-2 font-light text-lg text-white/90"
          >
            Category *
          </label>
          <select
            id="post-category"
            {...register("categories")}
            className="auth_input ps-4 text-base"
            disabled={isSubmitting || categoriesLoading}
            aria-invalid={!!errors.categories}
            aria-describedby={errors.categories ? "category-error" : undefined}
          >
            <option value="" className="bg-bg">
              {categoriesLoading ? "Loading categories..." : "Select Category"}
            </option>
            {categories?.map((cat) => (
              <option className="bg-bg" key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categories && (
            <p
              id="category-error"
              className="text-red-400 text-sm mt-2"
              role="alert"
            >
              {errors.categories.message}
            </p>
          )}
        </div>

        {/* IMAGE */}
        <ImageUploader
          register={register}
          setValue={setValue}
          preview={imagePreview}
          setPreview={setImagePreview}
          error={errors.coverImage?.message}
        />

        {/* EDITOR */}
        <div role="group" aria-labelledby="editor-label">
          <p
            id="editor-label"
            className="block mb-2 font-light text-lg text-white/90"
          >
            Detailed Content *
          </p>
          <BlogEditor onChange={handleEditorChange} value={watch("content")} disabled={isSubmitting} />
          {errors.content && (
            <p className="text-red-400 text-sm mt-2" role="alert">
              {errors.content.message}
            </p>
          )}
        </div>

        <Button
          loading={isSubmitting}
          loadingText={isEdit ? "Updating" : "Publishing"}
        >
          {isEdit ? "Update Blog" : "Publish Blog"}
        </Button>
      </form>
    </div>
  );
};

export default BlogForm;
