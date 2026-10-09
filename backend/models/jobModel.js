const mongoose = require("mongoose");

const jobSkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Intermediate",
    },
    importance: {
      type: String,
      enum: ["Must-Have", "Preferred", "Bonus"],
      default: "Must-Have",
    },
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    logo: {
      type: String,
      default: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop&crop=faces",
    },
    location: { type: String, required: true, trim: true },
    jobType: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Contract", "Remote", "Hybrid"],
      default: "Full-time",
    },
    experienceLevel: {
      type: String,
      enum: ["Entry", "Junior", "Mid-Level", "Senior", "Lead"],
      default: "Mid-Level",
    },
    category: {
      type: String,
      enum: [
        "Fullstack",
        "Frontend",
        "Backend",
        "DevOps & Cloud",
        "Mobile",
        "AI & Data",
        "Other",
      ],
      default: "Fullstack",
    },
    salary: { type: Number },
    salaryDisplay: { type: String, default: "$90,000 - $120,000" },
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    benefits: [{ type: String }],

    // Required skills (must have for compatibility)
    requiredSkills: [{ type: String, trim: true }],

    // Preferred / nice-to-have skills
    preferredSkills: [{ type: String, trim: true }],

    // Creator / Owner of the job (optional for seeded jobs)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    postedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Index for full text search across title, company, description, and skills
jobSchema.index({
  title: "text",
  company: "text",
  description: "text",
  requiredSkills: "text",
});

module.exports = mongoose.model("Job", jobSchema);
