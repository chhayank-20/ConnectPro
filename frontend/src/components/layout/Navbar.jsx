import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link, Navigate , NavLink, useNavigate } from "react-router-dom";
import { Bell, Home, LogOut, Briefcase ,Mail ,User, Users } from "lucide-react";
import Cookies from 'js-cookie';
import toast from "react-hot-toast";
import './navbar.css'; 

const Navbar = () => {
  // const navigate = useNavigate();
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();
  const navigate = useNavigate(); 

	const { data: notifications } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => axiosInstance.get("/notifications"),
		enabled: !!authUser,
	});

	const { data: connectionRequests } = useQuery({
		queryKey: ["connectionRequests"],
		queryFn: async () => axiosInstance.get("/connections/requests"),
		enabled: !!authUser,
	});

  const { data: jobs } = useQuery({
		queryKey: ["jobs"],
		queryFn: async () => axiosInstance.get("/connections/requests"),
		enabled: !!authUser,
	});


	const { mutate: logout } = useMutation({
		mutationFn: () => axiosInstance.post("/auth/logout"),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

  const searchUser = async()=>{
    const search = document.querySelector('#search');
    // alert(search.value);
    const response= await axiosInstance.get(`/users/get-user-by-name` , {name : search.value});
    console.log(response.data);

  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
        searchUser();
    }
};

const { mutate: logoutUser } = useMutation({
  mutationFn: () => axiosInstance.post("/auth/logout"), // Makes a POST request to the logout endpoint
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["authUser"] }); // Invalidates the 'authUser' query to remove cached user data
  },
});


const handleLogout = async () => {
  try {
    await logoutUser();
    Cookies.remove('jwt-connectpro', { path: '' });
    await queryClient.invalidateQueries('authUser');
    toast.success("Logged out successfully!");
    navigate('/login');  // Or use `window.location.href = '/login';` for a full page reload
  } catch (error) {
    toast.error("Logout failed!");
  }
};


  const [menuOpen, setMenuOpen] = useState(false);
	return (

		<>
		    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow">
      <div className="container-fluid " >
        <div className="navbar-brand" style={{ color: '#0073b1', fontWeight: 'bold' }}>
        <img src='./images/image.png' alt="Logo" width={'230px'} height={'20px'}/>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto pl-6 mb-2 mb-lg-0">

		  <li className="nav-item pl-6">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Home className={({ isActive }) => (isActive ? 'glow' : '')} />
        </NavLink>
      </li>
      <li className="nav-item pl-6">
        <NavLink 
          to="/network" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Users className={({ isActive }) => (isActive ? 'glow' : '')} />
        </NavLink>
      </li>
      <li className="nav-item pl-6">
        <NavLink 
          to="/job" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Briefcase className={({ isActive }) => (isActive ? 'glow' : '')} />
        </NavLink>
      </li>
      <li className="nav-item pl-6">
        <NavLink 
          to="/chat" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Mail className={({ isActive }) => (isActive ? 'glow' : '')} />
        </NavLink>
      </li>
      <li className="nav-item pl-6">
        <NavLink 
          to="/notifications" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Bell className={({ isActive }) => (isActive ? 'glow' : '')} />
        </NavLink>
      </li>
      <li className="nav-item pl-6">
        <NavLink 
          to={`/profile/${authUser?.username}`} 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <User  className={({ isActive }) => (isActive ? 'glow' : '')} />
        </NavLink>
      </li>

        </ul>

          <div className="d-flex">
            {/* <input id="search" onKeyDown={handleKeyDown} className="rounded p-2 me-4" type="search" placeholder="Search..." aria-label="Search" /> */}
            {/* <button  className="btn btn-outline-primary" >🔍</button> */}
            <button onClick={handleLogout} className="btn bg-blue d-flex justify-content-center align-items-center">
  <LogOut /> Logout
</button>
		
          </div>
        </div>
      </div>
    </nav>
		</>

	);
};
export default Navbar;