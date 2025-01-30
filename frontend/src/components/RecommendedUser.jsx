import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Check, Clock, UserCheck, UserPlus, X } from "lucide-react";

const RecommendedUser = ({ user }) => {
	const queryClient = useQueryClient();

	const { data: connectionStatus, isLoading } = useQuery({
		queryKey: ["connectionStatus", user._id],
		queryFn: () => axiosInstance.get(`/connections/status/${user._id}`),
	});

	const { mutate: sendConnectionRequest } = useMutation({
		mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
		onSuccess: () => {
			toast.success("Connection request sent successfully");
			queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.error || "An error occurred");
		},
	});

	const { mutate: acceptRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request accepted");
			queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.error || "An error occurred");
		},
	});

	const { mutate: rejectRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request rejected");
			queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.error || "An error occurred");
		},
	});

	const renderButton = () => {
		if (isLoading) {
			return (
				<button className="px-4 py-2 min-w-[100px] rounded-full text-sm bg-gray-200 text-gray-500" disabled>
					Loading...
				</button>
			);
		}

		switch (connectionStatus?.data?.status) {
			case "pending":
				return (
					<button className="px-4 py-2 min-w-[100px] bg-yellow-500 rounded-full text-sm text-white flex items-center justify-center" disabled>
						<Clock size={16} className="mr-1" />
						Pending
					</button>
				);
			case "received":
				return (
					<div className="flex gap-3 flex-wrap justify-end">
						<button
							onClick={() => acceptRequest(connectionStatus.data.requestId)}
							// className="rounded-full px-4 py-2 flex items-center bg-green-500 hover:bg-green-600 text-white"
							className="rounded-full px-4 py-2 flex items-center bg-gradient-to-r from-purple-700 to-blue-700 hover:bg-green-600 text-white"
						>
							<Check size={16} className="mr-1" />
							Accept
						</button>
						<button
							onClick={() => rejectRequest(connectionStatus.data.requestId)}
							// className="rounded-full px-4 py-2 flex items-center bg-red-500 hover:bg-red-600 text-white"
							className="rounded-full px-4 py-2 flex items-center bg-gradient-to-r from-purple-200 to-blue-200 hover:bg-red-600 text-black"
						>
							<X size={16} className="mr-1" />
							Reject
						</button>
					</div>
				);
			case "connected":
				return (
					<button className="px-4 py-2 min-w-[100px] bg-green-500 rounded-full text-sm text-white flex items-center justify-center" disabled>
						<UserCheck size={16} className="mr-1" />
						Connected
					</button>
				);
			default:
				return (
					<button
						className="px-4 py-2 min-w-[100px] border border-blue-500 text-blue-500 hover:bg-gradient-to-r from-purple-800 to-blue-800 transition-all duration-200 flex items-center justify-center"
						onClick={handleConnect}
					>
						<UserPlus size={16} className="mr-1" />
						Connect
					</button>
				);
		}
	};

	const handleConnect = () => {
		if (connectionStatus?.data?.status === "not_connected") {
			sendConnectionRequest(user._id);
		}
	};

	return (
		<div className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-wrap items-center justify-between">
			<Link to={`/profile/${user.username}`} className="flex items-center flex-grow no-underline">
				<img
					src={user.profilePicture || "/avatar.png"}
					alt={user.name}
					className="w-12 h-12 rounded-full mr-3 border border-gray-300"
				/>
				<div>
					<h3 className="font-semibold text-sm text-gray-800">{user.name}</h3>
					<p className="text-xs text-gray-500">{user.headline}</p>
				</div>
			</Link>
			<div className="flex justify-end w-full mt-2 sm:mt-0 sm:w-auto">{renderButton()}</div>
		</div>
	);
};

export default RecommendedUser;
