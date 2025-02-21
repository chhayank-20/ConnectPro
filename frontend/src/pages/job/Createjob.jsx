import React, { useState } from 'react';
import axios from 'axios';
import { axiosInstance } from '../../lib/axios';
import toast from "react-hot-toast";
import { useSelector } from 'react-redux';
import JobNav from './JobNav';  
import UserCreatedJobs from './UserCreatedJobs';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './Createjob.css'; // Import custom CSS for further styling

const CreateJob = () => {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary: '',
    jobType: 'Full-time', // Default value
    skills: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const skillsArray = jobData.skills.split(',').map(skill => skill.trim()); // Convert skills to an array

    const jobPayload = {
      ...jobData,
      skills: skillsArray,
      salary: jobData.salary,
    };

    try {
      alert("Creating job entry...");
      const response = await axiosInstance.post('/job/create', jobPayload); // Adjust the endpoint as needed
      toast.success('Job created successfully!');
      console.log(response.data);

      setJobData({
        title: '',
        description: '',
        company: '',
        location: '',
        salary: '',
        jobType: 'Full-time',
        skills: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create job');
      console.error(error);
    }
  };

  return (
    <>
      <JobNav />
      <div className="container bg-white rounded my-6">
        <div className="container my-6">
          <form className="bg-light p-6 rounded shadow-sm">
            <div className="h2 text-purple-800 d-flex justify-content-center align-items-center">Create Job</div>

            <div className="mb-3">
              <label htmlFor="title" className="form-label">Job Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Job Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={jobData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="company" className="form-label">Company</label>
              <input
                type="text"
                className="form-control"
                id="company"
                name="company"
                value={jobData.company}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                id="location"
                name="location"
                value={jobData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="salary" className="form-label">Salary</label>
              <input
                type="text"
                className="form-control"
                id="salary"
                name="salary"
                value={jobData.salary}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="jobType" className="form-label">Job Type</label>
              <select
                className="form-select"
                id="jobType"
                name="jobType"
                value={jobData.jobType}
                onChange={handleChange}
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="skills" className="form-label">Skills (comma separated)</label>
              <input
                type="text"
                className="form-control"
                id="skills"
                name="skills"
                value={jobData.skills}
                onChange={handleChange}
                required
              />
            </div>

            <button onClick={handleSubmit} type="submit" className="btn btn-primary bg-primary">Create Job</button>
          </form>
        </div>
      </div>

      <UserCreatedJobs/>  

    </>
  );
};

export default CreateJob;
