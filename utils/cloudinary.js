import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { log } from "console";

dotenv.config();

// Setup Cloudinary config once
cloudinary.config({
  cloud_name: "dkub1i83z",
  api_key: "446712652221824",
  api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 * Upload an image to Cloudinary
 * @param {string} filePath - Local path to the image file
 * @param {string} publicId - Public ID to use in Cloudinary
 * @returns {string} - Optimized Cloudinary image URL
 */
export async function uploadImage(filePath, publicId) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
    });

    // Return optimized URL (e.g. auto-format + auto-quality)
    return cloudinary.url(result.public_id, {
      fetch_format: "auto",
      quality: "auto",
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}

/**
 * Delete an image from Cloudinary by public ID
 * @param {string} publicId - The Cloudinary public ID of the image to delete
 * @returns {object} - Result of the deletion
 */
export async function deleteImage(publicId) {
  log(publicId);
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
}

export function extractPublicId(imageUrl) {
  try {
    const parts = imageUrl.split("/");
    const fileNameWithParams = parts[parts.length - 1]; // e.g. "abc123?_a=xyz"
    const fileName = fileNameWithParams.split("?")[0]; // removes "?_a=..."
    const [publicId] = fileName.split(".");
    return decodeURIComponent(publicId);
  } catch (err) {
    console.error("Failed to extract public ID from URL:", err);
    return null;
  }
}
