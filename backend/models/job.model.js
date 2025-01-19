import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    jobType: { type: String, required: true, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'] },
    skills: [{ type: String, required: true }], // Array of skills required for the job
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User who created the job
    applicants: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        appliedAt: { type: Date, default: Date.now },
      },
    ], // List of users who applied for the job
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);




