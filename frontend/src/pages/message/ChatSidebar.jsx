import { axiosInstance } from "../../lib/axios";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatArea from "./ChatArea";
import { toast } from "react-hot-toast";

const ChatSidebar = () => {
    const currentUser = useSelector(store => store.authorizedUser.user);
    const [userForChat, setUserForChat] = useState({});
    const navigate = useNavigate();

    const { data: userConversations, isLoading, isError } = useQuery({
        queryKey: ["userConversations", currentUser._id],
        queryFn: async () => {
            console.log("Fetching conversations...");
            const response = await axiosInstance.get('/connections/');
            console.log(response.data);
            return response.data; // Correctly return response.data
        },
    });

    const getUserById = async (username) => {
        try {
            const res = await axiosInstance.get(`/users/${username}`);  // Fix the endpoint syntax
            console.log(res.data);
            setUserForChat(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    };

    const conversationHandle = (username) => {
        return async() => {
           await getUserById(username);
            
            navigate('/chat');
        };
    };

    // Handle loading state
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Handle error state
    if (isError) {
        return <div>Error loading conversations</div>;
    }

    // Ensure userConversations is not undefined before mapping over it
    if (!userConversations || userConversations.length === 0) {
        return <div>No conversations / connections available</div>;
    }

    return (
        <>
            <div style={{ height: "80vh" }} className="w-full md:w-1/4 bg-white border-r border-gray-200">
                <div className="p-4">
                    <h2 className="text-lg font-semibold">CHATS</h2>
                </div>
                <div className="overflow-y-auto">
                    {userConversations.map((convo) => (
                        <div
                            onClick={conversationHandle(convo.username)} // Now correctly wrapped in a function
                            className="d-flex p-2 border justify-content-center align-items-center cursor-pointer"
                            key={convo._id}
                        >
                            <img
                                src={convo.profilePicture}
                                alt={`Profile picture of ${convo.name}`}
                                className="w-10 h-10 rounded-full mr-3"
                            />
                            <h6 className="font-semibold">{convo.name}</h6>
                        </div>
                    ))}
                </div>
                <div className="p-4">
                    {/* <button className="w-full py-2 bg-primary text-white rounded-lg">START NEW CHAT</button> */}
                </div>
            </div>

            <ChatArea user={userForChat} />
        </>
    );
};

export default ChatSidebar;
