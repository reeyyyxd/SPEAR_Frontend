import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/imgs/logo-light.png";
import homeIcon from "../../assets/icons/home-icon.svg";
import teamIcon from "../../assets/icons/team-icon.svg";
import settingsIcon from "../../assets/icons/settings-icon.svg";
import logOutIcon from "../../assets/icons/log-out-icon.svg";
import projectProposalsIcon from "../../assets/icons/proposals-icon.svg";
// import manageUsersIcon from "../../assets/icons/manage-users-icon.svg";
// import manageTeamsIcon from "../../assets/icons/manage-teams-icon.svg";

const Navbar = ({ userRole }) => {
  const location = useLocation();
  const [isLogOutOpen, setLogOutOpen] = useState(false);
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  // Define navigation items for each role
  const navItemsByRole = {
    STUDENT: [
      { label: "Dashboard", path: "/student-dashboard", icon: homeIcon },
      { label: "Team Formation", path: "/team-formation", icon: teamIcon },
      { label: "Settings", path: "/settings", icon: settingsIcon },
    ],
    TEACHER: [
      { label: "Dashboard", path: "/teacher-dashboard", icon: homeIcon },
      {
        label: "Project Proposals",
        path: "/project-proposals",
        icon: projectProposalsIcon,
      },
      { label: "Settings", path: "/settings", icon: settingsIcon },
    ],
    ADMIN: [
      { label: "Dashboard", path: "/admin-dashboard", icon: homeIcon },
      {
        label: "Project Proposals",
        path: "/project-proposals",
        icon: projectProposalsIcon,
      },
      // { label: "Manage Users", path: "/manage-users", icon: manageUsersIcon },
      // { label: "Manage Teams", path: "/manage-teams", icon: manageTeamsIcon },
    ],
  };

  const navItems = navItemsByRole[userRole] || []; // Fallback to an empty array for unknown roles

  const NavItem = ({ label, path, icon }) => (
    <li
      className={`flex items-center p-3 rounded-md text-base transition-all duration-300 ${
        isActive(path)
          ? "bg-peach text-white"
          : "hover:bg-peach hover:text-white"
      }`}
    >
      <img src={icon} alt={`${label} Icon`} className="w-5 h-5 mr-3" />
      <Link to={path} className="flex-1">
        {label}
      </Link>
    </li>
  );

  const handleLogOut = () => {
    // Clear user-related data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="navbar h-auto w-64 bg-teal text-white p-6 flex flex-col items-center">
      <div className="fixed">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Company Logo"
            className="w-24 h-auto rounded-md"
          />
        </div>

        {/* Navigation Section */}
        <ul className="flex flex-col mt-10 space-y-10">
          {navItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}

          {/* Log Out Item */}
          <li
            className="flex items-center p-3 rounded-md text-base transition-all duration-300 hover:bg-peach hover:text-white"
            onClick={() => setLogOutOpen(true)}
          >
            <img src={logOutIcon} alt="Log Out Icon" className="w-5 h-5 mr-3" />
            <span className="flex-1 cursor-pointer">Log Out</span>
          </li>
        </ul>

        {/* Log Out Modal */}
        {isLogOutOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white text-teal p-6 rounded-md shadow-md text-center">
              <p>Are you sure you want to log out?</p>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  onClick={() => setLogOutOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogOut}
                  className="bg-teal text-white px-4 py-2 rounded hover:bg-peach"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
