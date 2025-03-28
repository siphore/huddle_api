import mongoose from "mongoose";

const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    maxlength: [30, "Title must not exceed 30 characters"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    trim: true,
  },
  img: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Article", articleSchema);
