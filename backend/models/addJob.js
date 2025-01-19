import mongoose from 'mongoose';
import Job from './job.model.js'; // Assuming you have saved the schema in 'models/job.js'
import { connectDB } from '../lib/db.js';

setTimeout(() => {connectDB();}, 2500); // Wait for MongoDB connection to be established


const user1 = new mongoose.Types.ObjectId(); // Mocked user ID
const user2 = new mongoose.Types.ObjectId(); // Mocked user ID

const jobData = [
  {
    title: 'Software Engineer',
    description: 'We are looking for a passionate software engineer to join our team and help build innovative products.',
    company: 'TechCorp Solutions',
    location: 'New York, NY',
    salary: 95000,
    jobType: 'Full-time',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    postedBy: user1, // Assume user1 is the one posting this job
    applicants: [
      { userId: user2, appliedAt: new Date('2025-01-15T09:00:00Z') }
    ]
  },
  {
    title: 'Marketing Intern',
    description: 'Seeking a creative marketing intern to assist with campaigns, social media, and research.',
    company: 'Creative Minds Agency',
    location: 'Los Angeles, CA',
    salary: 20000,
    jobType: 'Internship',
    skills: ['Social Media', 'Content Creation', 'Market Research'],
    postedBy: user1, // Assume user1 is the one posting this job
    applicants: []
  },
  {
    title: 'Product Manager',
    description: 'Looking for a product manager to lead the development of new features and improve user experience.',
    company: 'InnovateX',
    location: 'Remote',
    salary: 120000,
    jobType: 'Full-time',
    skills: ['Product Strategy', 'User Research', 'Agile'],
    postedBy: user2, // Assume user2 posted this job
    applicants: []
  }
];

Job.insertMany(jobData)
  .then((jobs) => {
    console.log('Dummy jobs data inserted:', jobs);
  })
  .catch((error) => {
    console.error('Error inserting dummy job data:', error);
  });
