import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },
  expiresAt: { type: Date, required: true },
});

const Token = mongoose.model("Token", tokenSchema);

export default Token;