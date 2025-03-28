import mongoose from "mongoose";

const Schema = mongoose.Schema;

const formationSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    maxlength: [30, "Title must not exceed 30 characters"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Formation", formationSchema);
