import express from "express";
import { testUser } from "../middleware/testUser.js";
import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobs.js";

const router = express.Router();

router.route("/").post(testUser, createJob).get(getAllJobs);
router
  .route("/:id")
  .get(getJob)
  .delete(testUser, deleteJob)
  .patch(testUser, updateJob);

export default router;
