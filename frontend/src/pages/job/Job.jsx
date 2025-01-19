import React, { useState, useEffect } from 'react';
import { useQueryClient , useMutation , useQuery } from '@tanstack/react-query';
import {useSelector} from 'react-redux';
import { axiosInstance } from '../../lib/axios';
import CreateJob from './Createjob.jsx';
import { useNavigate } from 'react-router-dom';
import JobNav from './JobNav.jsx';

const Job = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [tags, setTags] = useState([
    'Marketing Manager',
    'HR',
    'Legal',
    'Sales',
    'Amazon',
    'Google',
    'Analyst'
  ]);


  const currentUser = useSelector((state) => state.authorizedUser.user); 

  const { data : allJobs , isLoading} = useQuery({ 
    queryKey : ["Jobs"] ,
    queryFn : async () =>{
      const response = await axiosInstance.get("/job/all-jobs");
      setJobs(response.data.jobs);
      return response.data;
    } 
  })

  if(isLoading) return <div>Loading...</div>
  if(!allJobs) return <div>No Jobs Found</div>


  return (<>
      <JobNav/>
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
            <div className="d-flex flex-column flex-md-row gap-2 justify-content-md-start mt-3">
              <button className="btn btn-primary btn bg-primary">Actively looking</button>
              <button className="btn btn-outline-primary btn">Casually browsing</button>
            </div>
          </div>
          <div className="col-md-4">
            {/* <img src="header.js" alt="Job search" className="img-fluid" /> */}
          </div>
        </div>
      </div>

      {/* Job Picks */}
      <div className="mt-4 bg-white rounded shadow-sm p-4">
        <h5 className="fw-bold">Top job picks for you</h5>
        <p className="text-secondary">
          Based on your profile, preferences, and activity like applies, searches, and saves
        </p>
        <div className="row g-3 mt-3">
          {jobs.map((job ,index) => (
            <div key={index} className="col-12">
              <div className="d-flex border rounded shadow-sm">
                {/* <img
                  src={job.logo}
                  alt="Company logo"
                  className="img-fluid"
                  style={{ width: '150px', height: 'auto' }}
                /> */}
                <div className="p-3 flex-grow-1">
                  <h6 className="fw-bold">{job.title}</h6>
                  <p className="text-secondary mb-1">{job.company} - {job.location}</p>
                  <p className="text-primary mb-1">{job.salary}</p>
                  <button className="btn btn-primary bg-primary btn-sm mt-2">Apply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-link w-100 mt-3">Show all →</button>
      </div>

      {/* Suggested Job Searches */}
      {/* <div className="mt-4 bg-white rounded shadow-sm p-4">
        <h5 className="fw-bold">Suggested job searches</h5>
        <div className="d-flex flex-wrap gap-2 mt-3">
          {tags.map((tag, index) => (
            <button key={index} className="btn btn-outline-secondary btn-sm">
              {tag}
            </button>
          ))}
        </div>
      </div> */}
    </div>
    </>
  );
};

export default Job;
