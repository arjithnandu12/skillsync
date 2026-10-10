const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Default popular skills catalog for quick-add recommendations
const POPULAR_SKILLS = [
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "JavaScript", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "MongoDB", category: "Database" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Docker", category: "DevOps & Cloud" },
  { name: "Kubernetes", category: "DevOps & Cloud" },
  { name: "AWS", category: "DevOps & Cloud" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "GraphQL", category: "Backend" },
  { name: "Redis", category: "Database" },
  { name: "CI/CD", category: "DevOps & Cloud" },
  { name: "Git", category: "Tools & Methodologies" },
];

// @desc Register User
// @route POST /api/user/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, title, bio, skills, experienceLevel } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all required fields (username, email, password)");
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email: email.toLowerCase(),
    password: hashedPassword,
    title: title || "Software Developer",
    bio: bio || "Passionate engineer exploring skill matches.",
    experienceLevel: experienceLevel || "Mid-Level",
    skills: Array.isArray(skills) ? skills : [],
  });

  if (user) {
    const accessToken = jwt.sign(
      {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET || "default_fallback_secret_key_12345",
      { expiresIn: "30d" }
    );

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      title: user.title,
      bio: user.bio,
      experienceLevel: user.experienceLevel,
      skills: user.skills,
      accessToken,
      message: "User registered successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Login User
// @route POST /api/user/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET || "default_fallback_secret_key_12345",
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        title: user.title,
        bio: user.bio,
        experienceLevel: user.experienceLevel,
        yearsOfExperience: user.yearsOfExperience,
        location: user.location,
        skills: user.skills || [],
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc Get Current User
// @route GET /api/user/current
// @access Private
const currentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user);
});

// @desc Update user profile details
// @route PUT /api/user/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { title, bio, experienceLevel, yearsOfExperience, location, targetRoles, username } = req.body;

  if (username) user.username = username;
  if (title !== undefined) user.title = title;
  if (bio !== undefined) user.bio = bio;
  if (experienceLevel !== undefined) user.experienceLevel = experienceLevel;
  if (yearsOfExperience !== undefined) user.yearsOfExperience = yearsOfExperience;
  if (location !== undefined) user.location = location;
  if (targetRoles !== undefined) user.targetRoles = targetRoles;

  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

// @desc Update user skills (bulk update or replace)
// @route PUT /api/user/skills
// @access Private
const updateUserSkills = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { skills } = req.body;
  if (!Array.isArray(skills)) {
    res.status(400);
    throw new Error("Skills must be an array of skill objects");
  }

  user.skills = skills;
  const updatedUser = await user.save();

  res.status(200).json({
    message: "Skills updated successfully",
    skills: updatedUser.skills,
  });
});

// @desc Add a single skill to user profile
// @route POST /api/user/skills
// @access Private
const addUserSkill = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, proficiency, yearsOfExperience, category } = req.body;

  if (!name || !name.trim()) {
    res.status(400);
    throw new Error("Skill name is required");
  }

  // Check if skill already exists in user's profile
  const exists = user.skills.some(
    (s) => s.name.toLowerCase() === name.trim().toLowerCase()
  );

  if (exists) {
    res.status(400);
    throw new Error(`Skill '${name}' is already in your profile`);
  }

  user.skills.push({
    name: name.trim(),
    proficiency: proficiency || "Intermediate",
    yearsOfExperience: Number(yearsOfExperience) || 1,
    category: category || "Other",
  });

  const updatedUser = await user.save();
  res.status(201).json({
    message: "Skill added successfully",
    skills: updatedUser.skills,
  });
});

// @desc Remove a skill from user profile
// @route DELETE /api/user/skills/:skillName
// @access Private
const removeUserSkill = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const skillNameToRemove = decodeURIComponent(req.params.skillName).trim().toLowerCase();

  user.skills = user.skills.filter(
    (s) => s.name.toLowerCase() !== skillNameToRemove && s._id.toString() !== req.params.skillName
  );

  const updatedUser = await user.save();
  res.status(200).json({
    message: "Skill removed successfully",
    skills: updatedUser.skills,
  });
});

// @desc Get available popular skills catalog
// @route GET /api/user/popular-skills
// @access Public
const getPopularSkills = asyncHandler(async (req, res) => {
  res.status(200).json(POPULAR_SKILLS);
});

// @desc Get sample demo profiles for quick testing/switching
// @route GET /api/user/demo-profiles
// @access Public
const getDemoProfiles = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").limit(5);
  res.status(200).json(users);
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  updateUserProfile,
  updateUserSkills,
  addUserSkill,
  removeUserSkill,
  getPopularSkills,
  getDemoProfiles,
};
