import { useNavigate } from 'react-router-dom';

export default function JobItem({ job }) {
    const navigate = useNavigate();

    const handleViewApplicants = () => {
        navigate(`/applicants/${job._id}`);
    };

    return (
        <div className="job-item border rounded p-4 mb-3">
            <h3 className="font-semibold">{job.title}</h3>
            <p>{job.description}</p>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Salary:</strong> {job.salary}</p>
            <button 
                onClick={handleViewApplicants} 
                className="btn btn-primary mt-2"
            >
                View Applicants
            </button>
        </div>
    );
}