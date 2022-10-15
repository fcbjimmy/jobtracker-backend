const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const {
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
  createJob,
} = require("../controllers/jobController");

router
  .route("/")
  .get(authenticateUser, getAllJobs)
  .post(authenticateUser, createJob);
router.route("/updateJob/:id").patch(authenticateUser, updateJob);

router
  .route("/:id")
  .get(authenticateUser, getSingleJob)
  .delete(authenticateUser, deleteJob);

module.exports = router;
