import { useNavigate } from "react-router-dom";

const JobNav = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="d-flex flex-wrap mb-2 mx-4">
                <button className="btn btn-purple mx-4 btn-lg" onClick={() => { navigate('/job') }}>View All</button>
                <button className="btn btn-purple mx-4 btn-lg" onClick={() => { navigate('/create-job') }}>Create Job Alert</button>
                <button className="btn btn-purple mx-4 btn-lg" onClick={() => { navigate('/applied-job') }}>Applied Jobs</button>
            </div>
        </>
    );
};

export default JobNav;
