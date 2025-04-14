import mongoose from "mongoose";

const Schema = mongoose.Schema;

const informationSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    required: true,
    trim: true,
  },
  club: {
    type: String,
    required: true,
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
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  contract: {
    type: String,
    required: true,
    enum: ["part-time", "volunteer", "full-time"],
  },
});

export default mongoose.model("Information", informationSchema);
