import { useState, useEffect } from 'react';
import {axiosInstance} from '../../lib/axios';  
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import JobNav from './JobNav';  // Make sure to import JobNav
import JobItem from './JobItem';  // Make sure to import JobItem
import axios from 'axios';

const AppliedJobs = () => {
  // Initialize state with an empty array to prevent errors
  const [appliedJobs, setJobs] = useState([]);
  const [error, setError] = useState(null);  // For error handling
  // const [isLoading, setIsLoading] = useState(true);  // To manage loading state
  // const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const jobData = [
    {
      _id: '678a017302e638a70dd15ad5',
      title: 'Software Engineer',
      description: 'We are looking for a passionate software engineer to join our team and help build innovative products.',
      company: 'TechCorp Solutions',
      location: 'New York, NY',
    },
    {
      _id: '678a017302e638a70dd15ad7',
      title: 'Marketing Intern',
      description: 'Seeking a creative marketing intern to assist with campaigns, social media, and research.',
      company: 'Creative Minds Agency',
      location: 'Los Angeles, CA',
    },
    {
      _id: '678a017302e638a70dd15ad8',
      title: 'Product Manager',
      description: 'Looking for a product manager to lead the development of new features and improve user experience.',
      company: 'InnovateX',
      location: 'Remote',
    },
    {
      _id: '678c6ee5e5d649c7907aae48',
      title: 'dev',
      description: '5 years',
      company: 'XYZ Infotech',
      location: 'Maholi',
    },
  ];

  const { data : allJobs ,isLoading } = useQuery({ 
      queryKey : ["Jobs"] ,
      queryFn : async () =>{
        const response = await axiosInstance.get("/job/applied");
        setJobs(response.data.jobs);
        console.log(response.data);
        return response.data;
      } 
    })
  

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // alert("trying to get applied appliedJobs")
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        // const response = await axios.get('http://localhost:5000/api/v1/job/applied');
        const response = await axiosInstance.get(`/job/applied`);
        console.log("Your applied appliedJobs: ", response.data);
        setJobs(response.data.appliedJobs);
      } catch (err) {
        console.error("Error fetching appliedJobs:", err);
        setError('Failed to fetch appliedJobs');
      } finally {
        setIsLoading(false);  // Stop loading once the request is complete
      }
    };
    // fetchJobs();
  }, []);  // Empty dependency array means this runs only once on component mount

  if (isLoading) return <p>Loading...</p>;  // Handle loading state

  if (error) return <p>{error}</p>;  // Handle error state

  return (
    <>
      <JobNav />
      <div>
        
        {/* {appliedJobs.length === 0 ? (
          <p>No appliedJobs found.</p>
        ) : (
          appliedJobs.map((job) => <JobItem key={job._id} job={job} />)
        )} */}

<div className="container bg-white rounded my-5">
<h2 className='justify-content-center align-items-center d-flex mt-6 m-4'>Your appliedJobs</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        
        {jobData.map((job) => (
          <div key={job._id} className="col">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{job.title}</h5>
                <p className="card-text">{job.description}</p>
                <p className="card-text"><strong>Company:</strong> {job.company}</p>
                <p className="card-text"><strong>Location:</strong> {job.location}</p>
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

export default AppliedJobs;
