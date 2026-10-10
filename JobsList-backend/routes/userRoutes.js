const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  currentUser,
  updateUserProfile,
  updateUserSkills,
  addUserSkill,
  removeUserSkill,
  getPopularSkills,
  getDemoProfiles,
} = require("../controllers/userController");
const validateTokenHandler = require("../middleware/validateTokenHandler");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/popular-skills", getPopularSkills);
router.get("/demo-profiles", getDemoProfiles);

// Protected routes
router.get("/current", validateTokenHandler, currentUser);
router.put("/profile", validateTokenHandler, updateUserProfile);
router.put("/skills", validateTokenHandler, updateUserSkills);
router.post("/skills", validateTokenHandler, addUserSkill);
router.delete("/skills/:skillName", validateTokenHandler, removeUserSkill);

module.exports = router;
