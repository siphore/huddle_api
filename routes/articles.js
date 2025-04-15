import express from "express";
import Article from "../models/article.js";
import { authenticate } from "./auth.js";
import {
  uploadFile,
  deleteFile,
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
  "/type/:type",
  asyncHandler(async (req, res) => {
    const articles = await Article.find({ type: req.params.type }).sort({
      date: -1,
    });
    return res.json(articles);
  })
);

router.get(
  "/id/:id",
  asyncHandler(async (req, res) => {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    return res.json(article);
  })
);

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, content, author, tags, type } = req.body;
    const filePath = req.file.path;

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadFile(filePath, req.file.filename);

    // Delete the local file
    await fs.unlink(filePath);

    // Save article with cloudinary image URL
    const newArticle = new Article({
      title,
      content,
      author,
      date: new Date(),
      image: cloudinaryUrl,
      tags,
      type,
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
      await deleteFile(publicId);
    }

    res.json({ message: "Article deleted successfully", deletedArticle });
  })
);

export default router;
