import mongoose from "mongoose";

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  theme: {
    type: String,
    enum: ["events", "certifications", "workshops", "competitions", "camps"],
    required: true,
  },
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
  description: {
    type: String,
    required: true,
    trim: true,
  },
  organizer: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
    trim: true,
  },
  building: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  npaCity: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Event", eventSchema);
