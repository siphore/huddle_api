import express from "express";
import Article from "../models/article.js";
import { authenticate } from "./auth.js";
import {
  uploadImage,
  deleteImage,
  extractPublicId,
} from "../utils/cloudinary.js";
import multer from "multer";
import fs from "fs/promises";
import { log } from "console";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temp storage

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const articles = await Article.find().sort({ date: -1 });
    res.json(articles);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  })
);

router.post("/", upload.single("img"), async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const imagePath = req.file.path;

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadImage(imagePath, req.file.filename);

    // Delete the local file
    await fs.unlink(imagePath);

    // Save article with cloudinary image URL
    const newArticle = new Article({
      title,
      content,
      author,
      date: new Date(),
      img: cloudinaryUrl,
    });

    await newArticle.save();
    res.status(201).json({ message: "Article created", article: newArticle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading article" });
  }
});

router.delete(
  "/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    if (!deletedArticle)
      return res.status(404).json({ message: "Article not found" });

    // 🧠 Extract the public ID from the Cloudinary URL
    const publicId = extractPublicId(deletedArticle.img);
    if (publicId) {
      await deleteImage(publicId);
    }

    res.json({ message: "Article deleted successfully", deletedArticle });
  })
);

export default router;
