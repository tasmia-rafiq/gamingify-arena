// // ─── post.validation.js ──────────────────────────────────────────────────────

import { z } from "zod";

// Shared base validation
const baseSchema = {
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(200, "Title cannot exceed 200 characters"),

  summary: z
    .string()
    .min(20, "Summary must be at least 20 characters")
    .max(300, "Summary cannot exceed 300 characters"),

  categories: z
    .string()
    .min(1, "Category is required"),

  content: z
    .string()
    .min(100, "Content must be at least 100 characters"),
};

// File validation chain for coverImage
const fileValidation = z
  // ensure a file is provided
  .custom((value) => value && value.length > 0, {
    message: "Cover image is required.",
  })
  .refine(
    (files) => files[0].size <= 5 * 1024 * 1024,
    { message: "Image must be less than 5MB" }
  )
  .refine(
    (files) => ["image/jpeg", "image/png", "image/webp"].includes(files[0].type),
    { message: "Only JPG, PNG, and WebP formats are allowed" }
  );

// Optional file validation for edit mode
const optionalFileValidation = z
  .custom((value) => {
    // Accept undefined or empty FileList (no file selected)
    if (value === undefined) return true;
    if (value && value.length === 0) return true;
    // If a file exists, it must be valid
    return value && value.length > 0;
  })
  .refine(
    (files) => {
      // Skip validation if no file was provided
      if (!files || files.length === 0) return true;
      return files[0].size <= 5 * 1024 * 1024;
    },
    { message: "Image must be less than 5MB" }
  )
  .refine(
    (files) => {
      // Skip validation if no file was provided
      if (!files || files.length === 0) return true;
      return ["image/jpeg", "image/png", "image/webp"].includes(files[0].type);
    },
    { message: "Only JPG, PNG, and WebP formats are allowed" }
  )
  .optional();

// CREATE: coverImage is required
export const createBlogSchema = z.object({
  ...baseSchema,
  coverImage: fileValidation,
});

// EDIT: coverImage is optional
export const editBlogSchema = z.object({
  ...baseSchema,
  coverImage: optionalFileValidation,
});

// ─── post.validation.js ──────────────────────────────────────────────────────
// Zod validation schema for blog post submission.

// import { z } from "zod";

// export const blogSchema = (isEdit = false) =>
//   z.object({
//     title: z.string().min(10, "Title must be at least 10 characters").max(200),

//     summary: z.string().min(20).max(300),

//     categories: z.string().min(1, "Category is required"),

//     content: z.string().min(100, "Content must be at least 100 characters"),

//     coverImage: isEdit
//       ? z
//           .any()
//           .optional()
//           .refine(
//             (files) =>
//               !files || files.length === 0 || files[0]?.size <= 5 * 1024 * 1024,
//             { message: "Image must be less than 5MB" },
//           )
//           .refine(
//             (files) =>
//               !files ||
//               files.length === 0 ||
//               ["image/jpeg", "image/png", "image/webp"].includes(
//                 files[0]?.type,
//               ),
//             { message: "Only JPG, PNG, and WebP allowed" },
//           )
//       : z
//           .any()
//           .refine(
//             (files) => files && files.length > 0,
//             "Cover image is required",
//           )
//           .refine((files) => files[0]?.size <= 5 * 1024 * 1024, {
//             message: "Image must be less than 5MB",
//           })
//           .refine(
//             (files) =>
//               ["image/jpeg", "image/png", "image/webp"].includes(
//                 files[0]?.type,
//               ),
//             { message: "Only JPG, PNG, and WebP allowed" },
//           ),
//   });
