import express from "express";
import Podcast from "../models/podcast.js";
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
    const podcasts = await Podcast.find().sort({ number: 1 });
    res.json(podcasts);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) return res.status(404).json({ message: "Podcast not found" });
    res.json(podcast);
  })
);

router.post(
  "/",
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { number, theme, title, guest, author, description } = req.body;

      // Access uploaded files
      const audioFile = req.files["audio"]?.[0];
      const imageFile = req.files["image"]?.[0];

      if (!audioFile || !imageFile) {
        return res
          .status(400)
          .json({ message: "Both audio and image files are required" });
      }

      // Upload to Cloudinary
      const audioUrl = await uploadFile(
        audioFile.path,
        audioFile.filename,
        audioFile.originalname
      );
      const imageUrl = await uploadFile(
        imageFile.path,
        imageFile.filename,
        imageFile.originalname
      );

      // Delete the local files
      await fs.unlink(audioFile.path);
      await fs.unlink(imageFile.path);

      // Save podcast with cloudinary URLs
      const newPodcast = new Podcast({
        number,
        theme,
        title,
        guest,
        author,
        description,
        audio: audioUrl,
        image: imageUrl,
      });

      await newPodcast.save();
      res.status(201).json({ message: "Podcast created", podcast: newPodcast });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error uploading podcast" });
    }
  }
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    const deletedPodcast = await Podcast.findByIdAndDelete(req.params.id);
    if (!deletedPodcast)
      return res.status(404).json({ message: "Podcast not found" });

    // 🧠 Extract the public ID from the Cloudinary URL
    if (deletedPodcast.audio && deletedPodcast.image) {
      const audioPublicId = extractPublicId(deletedPodcast.audio);
      const imagePublicId = extractPublicId(deletedPodcast.image);
      log(audioPublicId);
      log(imagePublicId);

      await deleteFile(audioPublicId, "raw");
      await deleteFile(imagePublicId, "image");
    } else if (deletedPodcast.audio) {
      const audioPublicId = extractPublicId(deletedPodcast.audio);
      await deleteFile(audioPublicId, "raw");
    } else if (deletedPodcast.image) {
      const imagePublicId = extractPublicId(deletedPodcast.image);
      await deleteFile(imagePublicId, "image");
    }

    res.json({ message: "Podcast deleted successfully", deletedPodcast });
  })
);

export default router;
