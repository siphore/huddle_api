import mongoose from "mongoose";

const Schema = mongoose.Schema;

const eventSchema = new Schema({
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
  location: {
    type: Number,
    required: [true, "Location is required"],
  },
  date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: "Organizer",
    required: true,
  },
  contact: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  bookingOnline: {
    type: Boolean,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Event", eventSchema);
