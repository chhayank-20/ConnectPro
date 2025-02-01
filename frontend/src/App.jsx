import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";

import HomePage from "./pages/HomePage";
import Welcome from "./pages/welcome/Welcome";
import Login from "./pages/auth/Login";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import NotificationsPage from "./pages/NotificationsPage";
import NetworkPage from "./pages/NetworkPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import Job from "./pages/job/Job";
import { useDispatch } from "react-redux";
import { setUser } from "./lib/redux/authuser";
import CreateJob from "./pages/job/Createjob";
import ApplliedJobs from "./pages/job/Appliedjobs";
import Chat from "./pages/message/Chat";
import ResetPasswordForm from "./pages/auth/ForgotPassword";
import ProfileSetupForm from "./pages/auth/ProfileSetup"


function App() {

	const dispatch = useDispatch();
	const { data: authUser } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await axiosInstance.get("/auth/me");
				localStorage.setItem('logedinUser', JSON.stringify(res.data));
				dispatch(setUser(res.data));	
				return res.data;
			} catch (err) {
				if (err.response && err.response.status === 401) {
					console.log("User not logged in" , err.response.data.message);
					return null;
				}
				toast.error(err.response.data.message || "Something went wrong");
			}
		},
	});

	

	return (
		<Layout authUser={authUser}>
			<Routes>
				<Route path='/' element={authUser ? <HomePage /> : <Navigate to={"/login"} />} />
				<Route path='/home' element={authUser ? <HomePage /> : <Navigate to={"/login"} />} />
				<Route path='/welcome' element={!authUser ? <Welcome /> : <Navigate to={"/"} />} />
				<Route path='/signup' element={!authUser ? <Login /> : <Navigate to={"/"} />} />
				<Route path='/login' element={!authUser ? <Login /> : <Navigate to={"/"} />} />
				<Route path='/forgot-password' element={!authUser ? <ResetPasswordForm /> : <Navigate to={"/"} />} />
				<Route path='/notifications' element={authUser ? <NotificationsPage /> : <Navigate to={"/login"} />} />
				<Route path='/network' element={authUser ? <NetworkPage /> : <Navigate to={"/login"} />} />
				<Route path='/post/:postId' element={authUser ? <PostPage /> : <Navigate to={"/login"} />} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />} />
				<Route path='/job' element={authUser ? <Job /> : <Navigate to={"/login"} />} />
				<Route path='/create-job' element={authUser ? <CreateJob /> : <Navigate to={"/login"} />} />
				<Route path='/applied-job' element={authUser ? <ApplliedJobs /> : <Navigate to={"/login"} />} />
				<Route path='/chat' element={authUser ? <Chat /> : <Navigate to={"/login"} />} />
				<Route path='/profile-setup' element={ <ProfileSetupForm/>} />
			</Routes>
			<Toaster />
		</Layout>
	);
}

export default App;
