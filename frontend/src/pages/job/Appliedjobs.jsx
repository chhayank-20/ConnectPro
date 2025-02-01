
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../lib/axios';
import JobNav from './JobNav.jsx';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

const AppliedJobs = () => {
  const [jobs, setJobs] = useState([]);

  const { data: allJobs, isLoading } = useQuery({
    queryKey: ['AppliedJobs'],
    queryFn: async () => {
      const token = Cookies.get("jwt-connectpro");
      // console.log('token: ', token);
      // systango
      const response = await axiosInstance.get('/job/applied');
      console.log(response.data.appliedJobs);
      setJobs(response.data.appliedJobs);
      return response.data;
    },
  });

  if (isLoading) return <div> <JobNav /> Loading...</div>;
  if (!allJobs) return <div> <JobNav /> No Jobs Found</div>;

  return (

    <>
  <JobNav />
  <div className="container bg-white rounded my-5">
    <h2 className="justify-content-center align-items-center d-flex mt-6 m-4">
      Your Applied Jobs
    </h2>
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {Array.isArray(jobs) && jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job._id} className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-purple-700">{job.title}</h5>
                <p className="card-text text-purple-600">{job.description}</p>
                <p className="card-text text-purple-500">
                  <strong>{job.company}</strong> - {job.location}
                </p>
                <p className="card-text text-purple-400">{job.salary}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No jobs available.</p>
      )}
    </div>
  </div>
</>
  
  );
};

export default AppliedJobs;
