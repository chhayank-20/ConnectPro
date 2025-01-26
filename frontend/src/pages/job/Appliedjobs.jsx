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
  const [isLoading, setIsLoading] = useState(true);  // To manage loading state
  // const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

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
    fetchJobs();
  }, []);  // Empty dependency array means this runs only once on component mount

  if (isLoading) return <p>Loading...</p>;  // Handle loading state

  if (error) return <p>{error}</p>;  // Handle error state

  return (
    <>
      <JobNav />
      <div>
        <h2>Your appliedJobs</h2>
        {appliedJobs.length === 0 ? (
          <p>No appliedJobs found.</p>
        ) : (
          appliedJobs.map((job) => <JobItem key={job._id} job={job} />)
        )}
      </div>
    </>
  );
};

export default AppliedJobs;
