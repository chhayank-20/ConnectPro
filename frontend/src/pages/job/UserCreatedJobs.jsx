import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

const UserCreatedJobs = () => {
    
    const currentUser = useSelector((state) => state.authorizedUser.user);

    const { data: createdJobs, isLoading } = useQuery({
        queryKey: ['createdJobs', currentUser._id], // Include userId in the queryKey to avoid caching issues
        queryFn: async () => {
          const response = await axiosInstance.post('/job/created-jobs', { userId: currentUser._id });
          return response.data; // Directly return the response data
        },
    });

    // If loading, show loading message
    if (isLoading) return <div>Loading...</div>;

    // If no jobs or jobs are empty, show a message
    if (!createdJobs?.length) return <div>No Created Jobs</div>;

    // Now we can safely map over the jobs
    return (
        <>
                <div className="h2">Your Created Jobs</div>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-3">
                {createdJobs.map((job) => (
                    <div key={job._id} className="col">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title text-purple-700">{job.title}</h5>
                                <p className="card-text text-purple-600">{job.description}</p>
                                <p className="text-purple-500">
                                    <strong>{job.company}</strong> - {job.location}
                                </p>
                                <p className="text-purple-400">{job.salary}</p>
                                <div className="mt-auto">
                                
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default UserCreatedJobs;
