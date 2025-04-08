import mongoose from "mongoose";

const Schema = mongoose.Schema;

const podcastSchema = new Schema({
  number: {
    type: Number,
    required: true,
  },
  theme: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  guest: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  audio: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Podcast", podcastSchema);
