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
  with: {
    type: String,
    required: true,
    trim: true,
  },
  by: {
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
});

export default mongoose.model("Podcast", podcastSchema);
