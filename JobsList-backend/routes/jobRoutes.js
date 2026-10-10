const express = require("express");
const router = express.Router();
const {
  getJobs,
  newJob,
  getJobById,
  updateJobById,
  deleteJobById,
  checkJobCompatibility,
  batchCompatibility,
  getAllJobSkills,
} = require("../controllers/jobsController");
const validateTokenHandler = require("../middleware/validateTokenHandler");

// Specific routes first
router.get("/skills/all", getAllJobSkills);
router.post("/compatibility/batch", batchCompatibility);

// Root routes
router.route("/")
  .get(getJobs)
  .post(validateTokenHandler, newJob);

// Single Job routes
router.route("/:id")
  .get(getJobById)
  .put(validateTokenHandler, updateJobById)
  .delete(validateTokenHandler, deleteJobById);

// Compatibility route for single job
router.post("/:id/compatibility", checkJobCompatibility);

module.exports = router;
