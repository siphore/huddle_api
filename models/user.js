import mongoose from "mongoose";
import bcrypt from "bcrypt"; // Import bcrypt pour le hashage du mot de passe

const Schema = mongoose.Schema;

const userSchema = new Schema({
  pseudo: {
    type: String,
    required: true,
    maxlength: [16, "Pseudo must not exceed 16 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please provide a valid email"],
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "regular", "institution"], // Restrict to 'admin' or 'regular'
    default: "regular", // Default to 'regular'
  },
});

// Hashage du mot de passe avant la sauvegarde
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Méthode pour comparer le mot de passe en clair avec le hash stocké
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
