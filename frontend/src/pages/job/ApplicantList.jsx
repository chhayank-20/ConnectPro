import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';

const ApplicantList = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axiosInstance.get(`/job/${jobId}/applicants`);
        setApplicants(response.data.applicants);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch applicants');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  if (loading) return <div>Loading applicants...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Applicants for Job ID: {jobId}</h2>
      <ul>
        {applicants.map((applicant) => (
          <li key={applicant.userId}>
            {applicant.name} - Applied on {new Date(applicant.appliedAt).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicantList;