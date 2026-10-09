const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    proficiency: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Intermediate",
    },
    yearsOfExperience: { type: Number, default: 1 },
    category: {
      type: String,
      enum: [
        "Frontend",
        "Backend",
        "Database",
        "DevOps & Cloud",
        "Mobile",
        "AI & Data",
        "Tools & Methodologies",
        "Other",
      ],
      default: "Other",
    },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter your username"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    title: {
      type: String,
      default: "Software Developer",
      trim: true,
    },
    bio: {
      type: String,
      default: "Passionate developer looking to match with the right tech opportunities.",
    },
    experienceLevel: {
      type: String,
      enum: ["Entry", "Junior", "Mid-Level", "Senior", "Lead"],
      default: "Mid-Level",
    },
    yearsOfExperience: {
      type: Number,
      default: 2,
    },
    location: {
      type: String,
      default: "Remote",
    },
    targetRoles: [
      {
        type: String,
        trim: true,
      },
    ],
    // Store user skills with details & proficiency
    skills: [skillSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
