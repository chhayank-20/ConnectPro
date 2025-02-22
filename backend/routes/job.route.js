import express from 'express';
import {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getAppliedJobs,
  userCreatedJobs,
  userAppliedJobs,
  applyToJob,
} from '../controllers/job.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create', protectRoute, createJob);

router.post('/created-jobs', protectRoute, userCreatedJobs);

// Update a job by ID
router.put('update/:id', protectRoute, updateJob);

// Delete a job by ID
router.delete('delete/:id', protectRoute, deleteJob);

// View all jobs (No authentication required)
router.get('/all-jobs', getAllJobs);

// View a specific job by ID (Authentication required)
router.get('/get/:id', protectRoute, getJobById);

// Get applied jobs for the logged-in user (Authentication required)
router.get('/applied', protectRoute, userAppliedJobs);

// Apply to a job (Authentication required)
router.post('/apply/:id', protectRoute, applyToJob);

// Optional: Filter jobs based on criteria (Uncomment when implemented)
// router.get('/filter', filterJobs);

export default router;


