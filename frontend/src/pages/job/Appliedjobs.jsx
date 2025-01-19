import React from 'react';
import { useQuery } from '@tanstack/react-query';  // Import useQuery
import axios from 'axios';
import {axiosInstance} from '../../lib/axios';

import JobItem from './JobItem';
import JobNav from './JobNav';



// Function to fetch applied jobs
const fetchAppliedJobs = async () => {
  const response = await axiosInstance.get('/job/applied' );
  return response.data.jobs;  // Return the list of jobs
};

const AppliedJobs = () => {

    
  // Use the useQuery hook to fetch applied jobs
  const { data: jobs, error, isLoading } = useQuery({
    queryKey: ['appliedJobs'],  // Unique key for this query
    queryFn: fetchAppliedJobs,  // Function that fetches the jobs
  });

  // Render loading state
  if (isLoading) {
    return (
      <div>
        <JobNav />
        Loading jobs...
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div>
        <JobNav />
        Error fetching jobs: {error.message}
      </div>
    );
  }

  // Render the list of jobs
  return (
    <>
      <JobNav />
      <div>
        <h2>Your Jobs</h2>
        {jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          jobs.map((job) => <JobItem key={job._id} job={job} />)
        )}
      </div>
    </>
  );
};

export default AppliedJobs;

