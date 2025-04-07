import mongoose from "mongoose";

const Schema = mongoose.Schema;

const opportunitySchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    // maxlength: [30, "Title must not exceed 30 characters"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  club: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  license: {
    type: String,
    enum: [
      "Futsal Coach Level 1",
      "Physical Trainer Level 3",
      "Goalkeeper Coach Level 2 Youth",
      "Goalkeeper License A",
      "Children's sports expert",
      "Further training 2",
      "Diploma D",
      "C basic",
      "UEFA C",
      "B UEFA",
      "B UEFA Youth",
      "UEFA A",
      "UEFA Youth A",
      "UEFA Pro Licence",
    ],
    required: true,
    trim: true,
  },
  NPA: {
    type: Number,
    required: [true, "Description is required"],
    trim: true,
  },
  location: {
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

export default mongoose.model("Opportunity", opportunitySchema);
