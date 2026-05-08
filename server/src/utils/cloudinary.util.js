import fs from "fs/promises";
import cloudinary from "../config/cloudinary.js";

// ----- Upload Image -----
export const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "gamingify-arena/posts",
      resource_type: "image",
      transformation: [
        { width: 1200, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    fs.unlink(file.path).catch((err) =>
      console.error(`[Cloudinary] Failed to remove temp file ${file.path}:`, err.message)
    );

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    fs.unlink(file.path).catch((unlinkErr) =>
      console.error(`[Cloudinary] Failed to remove temp file after failed upload:`, unlinkErr.message)
    );
    throw error;
  }
};

// ----- Delete Image -----
export const deleteImage = async (publicId) => {
  if (!publicId) {
    // Nothing to delete — return silently rather than throwing
    return;
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });

  // "not found" means it was already deleted — treat as success
  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(
      `Cloudinary deletion failed for public_id "${publicId}": ${result.result}`
    );
  }
};