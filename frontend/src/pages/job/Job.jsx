import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../lib/axios';
import JobNav from './JobNav.jsx';
import toast from 'react-hot-toast';

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const currentUser = useSelector((state) => state.authorizedUser.user);

  const handleApplyJob = async (jobId) => {
    try {
      const response = await axiosInstance.post(`/job/apply/${jobId}`);
      toast.success("Applied successfully", response);
    } catch (error) {
      toast.error("Couldn't apply for this job", error);
    }
  };

  const { data: allJobs, isLoading } = useQuery({
    queryKey: ['Jobs'],
    queryFn: async () => {
      const response = await axiosInstance.get('/job/all-jobs');
      setJobs(response.data.jobs);
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!allJobs) return <div>No Jobs Found</div>;

  return (
    <>
      <JobNav />
      <div className="container my-4 p-3 bg-light rounded">
        <div className="h2 d-flex justify-content-center align-items-center">JOBS</div>

        {/* Header */}
        <div className="p-4 bg-white rounded shadow-sm text-center">
          <div className="row align-items-center">
            <div className="col-md-8 text-md-start">
              <h5 className="fw-bold">{currentUser.name}, are you looking for a new job?</h5>
              <p className="text-secondary">
                Add your preferences to find relevant jobs and get notified about new open roles.
              </p>
            </div>
            <div className="col-md-4"></div>
          </div>
        </div>

        {/* Job Cards */}
        <div className="mt-4 bg-white rounded shadow-sm p-4">
          <h5 className="fw-bold">Top job picks for you</h5>
          <p className="text-secondary">
            Based on your profile, preferences, and activity like applies, searches, and saves
          </p>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-3">
            {jobs.map((job, index) => (
              <div key={job._id} className="col">
                <div className="card h-100 shadow-sm">
                  {/* Uncomment to show company logo */}
                  {/* <img src={job.logo} alt="Company logo" className="card-img-top" /> */}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{job.title}</h5>
                    <p className="card-text">{job.description}</p>
                    <p className="text-muted">
                      <strong>{job.company}</strong> - {job.location}
                    </p>
                    <p className="text-primary">{job.salary}</p>
                    <div className="mt-auto">
                      <button
                        onClick={() => handleApplyJob(job._id)}
                        className="btn bg-primary btn-primary w-100"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Job;
