import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import { UserPlus } from "lucide-react";
import FriendRequest from "../components/FriendRequest";
import UserCard from "../components/UserCard";
import RecommendedUser from "../components/RecommendedUser";

const NetworkPage = () => {
  const { data: user } = useQuery({ queryKey: ["authUser"] });

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: () => axiosInstance.get("/connections/requests"),
  });

  const { data: connections } = useQuery({
    queryKey: ["connections"],
    queryFn: () => axiosInstance.get("/connections"),
  });

  const { data: recommendedUsers } = useQuery({
		queryKey: ["recommendedUsers"],
		queryFn: async () => {
			const res = await axiosInstance.get("/users/suggestions");
			return res.data;
		},
	});

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={user} />
      </div>
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-white rounded-lg shadow p-6 mb-6 hover:shadow-lg transition-shadow duration-300">
          <h1 className="text-2xl font-bold mb-6 text-purple-700 hover:text-purple-900 transition-colors duration-300">
            My Network
          </h1>

          {connectionRequests?.data?.length > 0 ? (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2 text-purple-600">
                Connection Requests
              </h2>
              <div className="space-y-4">
                {connectionRequests.data.map((request) => (
                  <FriendRequest key={request.id} request={request} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-purple-50 rounded-lg shadow p-6 text-center mb-6">
              <UserPlus size={48} className="mx-auto text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-purple-700">
                No Connection Requests
              </h3>
              <p className="text-purple-600">
                You don&apos;t have any pending connection requests at the moment.
              </p>
              <p className="text-purple-600 mt-2">
                Explore suggested connections below to expand your network!
              </p>
            </div>
          )}

          {connections?.data?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-purple-600">
                My Connections
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connections.data.map((connection) => (
                  <UserCard
                    key={connection._id}
                    user={connection}
                    isConnection={true}
                  />
                ))}
              </div>
            </div>
          )}

        {recommendedUsers?.length > 0 && (
          <div className=' col-span-1 rounded-lg  lg:col-span-1 hidden lg:block'>
            <div className='  rounded-lg shadow p-4'>
              <h2 className='font-semibold mb-4'>People you may know</h2>
              {recommendedUsers?.map((user) => (
                <RecommendedUser key={user._id} user={user} />
              ))}
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
};

export default NetworkPage;