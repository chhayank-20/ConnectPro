import { useNavigate } from "react-router-dom"


const JobNav = () => {
    const navigate = useNavigate();

    return (
    <>
    <div className="d-flex mb-2 mx-4" >
        <button className="btn btn-primary bg-primary mx-4 btn-lg" onClick={()=>{navigate('/job')}}>view All</button>
        <button className="btn btn-primary bg-primary mx-4 btn-lg" onClick={()=>{navigate('/create-job')}}>Create job alert</button>
        <button className="btn btn-primary bg-primary mx-4 btn-lg text-white" onClick={()=>{navigate('/applied-job')}}>Applied jobs</button>
    </div>        
    </>
    )
}

export default JobNav;