const asyncHandler = require("express-async-handler");
const Job = require("../models/jobModel");
const User = require("../models/userModel");
const { calculateCompatibility } = require("../utils/compatibilityEngine");

// @desc    Get all jobs with pagination, search, category filter, and skill filter
// @route   GET /api/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search = "",
    category = "",
    jobType = "",
    skill = "",
  } = req.query;

  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 20;

  const query = {};

  if (search && search.trim() !== "") {
    const s = search.trim();
    query.$or = [
      { title: { $regex: s, $options: "i" } },
      { company: { $regex: s, $options: "i" } },
      { location: { $regex: s, $options: "i" } },
      { description: { $regex: s, $options: "i" } },
      { requiredSkills: { $regex: s, $options: "i" } },
    ];
  }

  if (category && category !== "All") {
    query.category = category;
  }

  if (jobType && jobType !== "All") {
    query.jobType = jobType;
  }

  if (skill && skill.trim() !== "") {
    query.requiredSkills = { $regex: skill.trim(), $options: "i" };
  }

  const count = await Job.countDocuments(query);
  const jobs = await Job.find(query)
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber)
    .sort({ postedAt: -1, createdAt: -1 });

  res.status(200).json({
    data: jobs,
    total: count,
    pages: Math.ceil(count / limitNumber) || 1,
    currentPage: pageNumber,
  });
});

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  res.status(200).json(job);
});

// @desc    Check compatibility between user skills and a specific job
// @route   POST /api/jobs/:id/compatibility
// @access  Public (can accept skills in body, or take from auth user)
const checkJobCompatibility = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  let userSkills = req.body.skills;

  // If skills not provided directly in body, and user is authenticated
  if ((!userSkills || !Array.isArray(userSkills)) && req.user?._id) {
    const user = await User.findById(req.user._id);
    if (user) {
      userSkills = user.skills;
    }
  }

  const result = calculateCompatibility(userSkills || [], job);

  res.status(200).json({
    jobId: job._id,
    jobTitle: job.title,
    company: job.company,
    requiredSkills: job.requiredSkills,
    preferredSkills: job.preferredSkills,
    ...result,
  });
});

// @desc    Batch check compatibility across all jobs with given user skills
// @route   POST /api/jobs/compatibility/batch
// @access  Public
const batchCompatibility = asyncHandler(async (req, res) => {
  const { skills = [] } = req.body;
  const jobs = await Job.find({}).sort({ postedAt: -1 });

  const analyzed = jobs.map((job) => {
    const analysis = calculateCompatibility(skills, job);
    return {
      job,
      analysis,
    };
  });

  // Sort by highest compatibility score first
  analyzed.sort((a, b) => b.analysis.score - a.analysis.score);

  res.status(200).json({
    totalJobs: jobs.length,
    rankedJobs: analyzed,
  });
});

// @desc    Get unique list of all skills across all jobs
// @route   GET /api/jobs/skills/all
// @access  Public
const getAllJobSkills = asyncHandler(async (req, res) => {
  const jobs = await Job.find({}, { requiredSkills: 1, preferredSkills: 1 });
  const skillSet = new Set();

  jobs.forEach((j) => {
    (j.requiredSkills || []).forEach((s) => skillSet.add(s));
    (j.preferredSkills || []).forEach((s) => skillSet.add(s));
  });

  res.status(200).json(Array.from(skillSet).sort());
});

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private
const newJob = asyncHandler(async (req, res) => {
  const {
    title,
    company,
    logo,
    location,
    description,
    salary,
    salaryDisplay,
    jobType,
    experienceLevel,
    category,
    requiredSkills,
    preferredSkills,
    responsibilities,
    benefits,
  } = req.body;

  if (!title || !company || !location || !description || !jobType) {
    res.status(400);
    throw new Error("Please provide title, company, location, description, and job type");
  }

  // Parse skill arrays if they are strings
  const parsedRequired = Array.isArray(requiredSkills)
    ? requiredSkills
    : typeof requiredSkills === "string"
    ? requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const parsedPreferred = Array.isArray(preferredSkills)
    ? preferredSkills
    : typeof preferredSkills === "string"
    ? preferredSkills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const job = await Job.create({
    title,
    company,
    logo: logo || undefined,
    location,
    description,
    salary: Number(salary) || undefined,
    salaryDisplay: salaryDisplay || (salary ? `$${salary.toLocaleString()}` : "$90,000 - $130,000"),
    jobType,
    experienceLevel: experienceLevel || "Mid-Level",
    category: category || "Fullstack",
    requiredSkills: parsedRequired,
    preferredSkills: parsedPreferred,
    responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
    benefits: Array.isArray(benefits) ? benefits : [],
    user: req.user?._id,
  });

  res.status(201).json(job);
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  // If job has a user and user is not owner
  if (job.user && req.user && job.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this job");
  }

  if (typeof req.body.requiredSkills === "string") {
    req.body.requiredSkills = req.body.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean);
  }
  if (typeof req.body.preferredSkills === "string") {
    req.body.preferredSkills = req.body.preferredSkills.split(",").map((s) => s.trim()).filter(Boolean);
  }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updatedJob);
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.user && req.user && job.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this job");
  }

  await job.deleteOne();
  res.status(200).json({ message: "Job deleted successfully" });
});

module.exports = {
  getJobs,
  newJob,
  getJobById,
  updateJobById,
  deleteJobById,
  checkJobCompatibility,
  batchCompatibility,
  getAllJobSkills,
};
