import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link, Navigate , NavLink } from "react-router-dom";
import { Bell, Home, LogOut, Briefcase ,Mail ,User, Users } from "lucide-react";
import './Navbar.css'; 

const Navbar = () => {
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

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

	const { mutate: logout } = useMutation({
		mutationFn: () => axiosInstance.post("/auth/logout"),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const unreadNotificationCount = notifications?.data.filter((notif) => !notif.read).length;
	const unreadConnectionRequestsCount = connectionRequests?.data?.length;
	const [menuOpen, setMenuOpen] = useState(false);
	return (

		<>
		    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top shadow" style={{ background: 'linear-gradient(to right,rgb(206, 158, 236), #131187)' }}>
      <div className="container-fluid " >
        <div className="navbar-brand" style={{ color: '#0073b1', fontWeight: 'bold' }}>
          Connect Pro
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
          to="/messages" 
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
          to={`/profile/${authUser.username}`} 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <User  className={({ isActive }) => (isActive ? 'glow' : '')} />
        </NavLink>
      </li>

          </ul>

          <form className="d-flex">
            <input className="form-control me-4" type="search" placeholder="Search..." aria-label="Search" />
            <button className="btn btn-outline-primary" type="submit">🔍</button>
          </form>
        </div>
      </div>
    </nav>
		</>

	);
};
export default Navbar;
