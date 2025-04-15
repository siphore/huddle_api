import express from "express";
import Event from "../models/event.js";
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
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  })
);

router.get(
  "/theme/:theme",
  asyncHandler(async (req, res) => {
    const events = await Event.find({ theme: req.params.theme }).sort({
      date: 1,
    });
    return res.json(events);
  })
);

router.get(
  "/id/:id",
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    return res.json(event);
  })
);

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        theme,
        title,
        subtitle,
        description,
        organizer,
        requirements,
        building,
        address,
        npaCity,
        website,
      } = req.body;

      // Access uploaded files
      const imageFile = req.files["image"]?.[0];
      const iconFile = req.files["icon"]?.[0];

      if (!imageFile || !iconFile) {
        return res
          .status(400)
          .json({ message: "Both image and icon files are required" });
      }

      // Upload to Cloudinary
      const imageUrl = await uploadFile(
        imageFile.path,
        imageFile.filename,
        imageFile.originalname
      );
      const iconUrl = await uploadFile(
        iconFile.path,
        iconFile.filename,
        iconFile.originalname
      );

      // Delete the local files
      await fs.unlink(imageFile.path);
      await fs.unlink(iconFile.path);

      // Save event with cloudinary image URL
      const newEvent = new Event({
        theme,
        title,
        subtitle,
        description,
        organizer,
        date: new Date(),
        requirements,
        building,
        address,
        npaCity,
        website,
        image: imageUrl,
        icon: iconUrl,
      });

      await newEvent.save();
      res.status(201).json({ message: "Event created", event: newEvent });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error uploading event" });
    }
  }
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent)
      return res.status(404).json({ message: "Event not found" });

    // 🧠 Extract the public ID from the Cloudinary URL
    const publicId = extractPublicId(deletedEvent.img);
    if (publicId) {
      await deleteFile(publicId);
    }

    res.json({ message: "Event deleted successfully", deletedEvent });
  })
);

export default router;
