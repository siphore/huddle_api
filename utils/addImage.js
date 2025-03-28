import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

export default async function addImage(img, title) {
  // Configuration
  cloudinary.config({
    cloud_name: "dkub1i83z",
    api_key: "446712652221824",
    api_secret: process.env.CLOUDINARY_SECRET,
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(img, {
      public_id: title,
    })
    .catch((error) => {
      console.log(error);
    });

  console.log(uploadResult);

  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = cloudinary.url(title, {
    fetch_format: "auto",
    quality: "auto",
  });

  console.log(optimizeUrl);

  // Transform the image: auto-crop to square aspect_ratio
  const autoCropUrl = cloudinary.url(title, {
    crop: "auto",
    gravity: "auto",
    width: 500,
    height: 500,
  });

  console.log(autoCropUrl);
}
