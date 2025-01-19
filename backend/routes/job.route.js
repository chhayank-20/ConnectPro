import express from 'express';
import {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getAppliedJobs,
  // filterJobs,
  applyToJob,
} from '../controllers/job.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js';

const router = express.Router();

// Job Routes
router.post('/create', protectRoute, createJob); // Create a new job      
router.put('/:id', protectRoute, updateJob); // Update a job by ID
router.delete('/:id', protectRoute, deleteJob); // Delete a job by ID
router.get('/all-jobs',protectRoute, getAllJobs); // View all jobs
router.get('/:id',protectRoute, getJobById); // View a specific job by ID
router.get('/applied', getAppliedJobs); // Get applied jobs for logged-in user
// router.get('/filter', filterJobs); // Get filtered jobs based on criteria
router.post('/apply/:id', protectRoute, applyToJob); // representing the ID of the job the user wants to apply for.

export default router;



