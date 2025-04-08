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
 * Upload a file (image, video, audio) to Cloudinary
 * @param {string} filePath - Local path to the file
 * @param {string} publicId - Public ID to use in Cloudinary
 * @returns {string} - Optimized Cloudinary URL
 */
export async function uploadFile(filePath, publicId, originalName) {
  try {
    // Detect file type from extension
    const extension = originalName.split(".").pop().toLowerCase();

    let resourceType = "image"; // default
    if (["mp4", "mov", "avi", "mkv", "webm"].includes(extension)) {
      resourceType = "video";
    } else if (["mp3", "wav", "ogg", "flac"].includes(extension)) {
      resourceType = "raw"; // audio treated as "raw"
    }

    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      resource_type: resourceType,
    });

    // Handle optimized URL generation
    if (resourceType === "image") {
      // optimize images
      return cloudinary.url(result.public_id, {
        resource_type: "image",
        fetch_format: "auto",
        quality: "auto",
      });
    } else {
      // return direct secure URL for videos/audios
      return result.secure_url;
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}

/**
 * Delete a file from Cloudinary by public ID
 * @param {string} publicId - The Cloudinary public ID of the file
 * @param {string} [resourceType] - The resource type: image, video, or raw
 * @returns {object} - Result of the deletion
 */
export async function deleteFile(publicId, resourceType) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
}

/**
 * Extract public ID from a Cloudinary URL
 * @param {string} fileUrl - Full Cloudinary file URL
 * @returns {string|null} - Public ID without extension
 */
export function extractPublicId(fileUrl) {
  try {
    const parts = fileUrl.split("/");
    log(parts);
    const fileNameWithParams = parts[parts.length - 1]; // e.g., "filename.mp3?_a=123"
    log(fileNameWithParams);
    const cleanFileName = fileNameWithParams.split("?")[0];
    log(cleanFileName);
    const publicId = cleanFileName.split(".")[0];
    log(publicId);
    return decodeURIComponent(publicId);
  } catch (err) {
    console.error("Failed to extract public ID from URL:", err);
    return null;
  }
}
