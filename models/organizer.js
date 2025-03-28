import mongoose from "mongoose";

const Schema = mongoose.Schema;

const organizerSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    maxlength: [16, "Name must not exceed 16 characters"],
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please provide a valid email"],
    trim: true,
  },
  link: {
    type: String,
    required: [true, "Link is required"],
    trim: true,
  },
});

export default mongoose.model("Organizer", organizerSchema);
