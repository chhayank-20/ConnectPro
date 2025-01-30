import { Link } from "react-router-dom";
import { Home, UserPlus, Bell } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar({ user }) {
  return (
    <div className="sidebar-container bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow-lg">
      <div className="p-4 text-center">
        <div
          className="h-16 rounded-t-lg bg-cover bg-center"
          style={{
            backgroundImage: `url("${user.bannerImg || "/banner.png"}")`,
          }}
        />
        <Link to={`/profile/${user.username}`} className="no-underline">
          <img
            src={user.profilePicture || "/avatar.png"}
            alt={user.name}
            className="w-20 h-20 rounded-full mx-auto mt-[-40px] transition-all transform hover:scale-110"
          />
          <h2 className="text-xl font-semibold mt-2 text-purple-700 hover:text-purple-900 transition-colors">
            {user.name}
          </h2>
        </Link>
	   <p className="text-sm text-gray-600 custom-headline">{user.headline}</p>
<p className="text-xs text-gray-500 custom-connections">{user.connections.length} connections</p>

      </div>
      <div className="border-t border-base-100 p-4">
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="flex items-center py-2 px-4 rounded-md transition-transform transform hover:bg-purple-300 hover:text-white hover:scale-105 no-underline"
              >
                <Home className="mr-2" size={20} /> Home
              </Link>
            </li>
            <li>
              <Link
                to="/network"
                className="flex items-center py-2 px-4 rounded-md transition-transform transform hover:bg-purple-300 hover:text-white hover:scale-105 no-underline"
              >
                <UserPlus className="mr-2" size={20} /> My Network
              </Link>
            </li>
            <li>
              <Link
                to="/notifications"
                className="flex items-center py-2 px-4 rounded-md transition-transform transform hover:bg-purple-300 hover:text-white hover:scale-105 no-underline"
              >
                <Bell className="mr-2" size={20} /> Notifications
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-base-100 p-4">
        <Link
          to={`/profile/${user.username}`}
          className="text-sm font-semibold text-purple-700 hover:text-purple-900 transition-colors no-underline"
        >
          Visit your profile
        </Link>
      </div>
    </div>
  );
}
