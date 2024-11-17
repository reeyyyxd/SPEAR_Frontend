import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/imgs/logo-light.png";
import homeIcon from "../../assets/icons/home-icon.svg";
import teamIcon from "../../assets/icons/team-icon.svg";
import settingsIcon from "../../assets/icons/settings-icon.svg";
import logOutIcon from "../../assets/icons/log-out-icon.svg";
import LogOut from "../../pages/Student/UserManagment/LogOut";

const Navbar = () => {
  const location = useLocation();
  const [isLogOutOpen, setLogOutOpen] = useState(false); // State for the logout modal

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // Implement your logout logic here, like clearing tokens or redirecting
    console.log("User logged out");
    setLogOutOpen(false); // Close the modal after logout
  };

  return (
    <div className="navbar h-auto w-64 bg-teal text-white p-6 flex flex-col items-center">
      <div className="fixed">
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Company Logo"
            className="w-24 h-auto rounded-md"
          />
        </div>
        <ul className="flex flex-col mt-10 space-y-10">
          <li
            className={`flex items-center p-3 rounded-md text-base transition-all duration-300 ${
              isActive("/home")
                ? "bg-peach text-white"
                : "hover:bg-peach hover:text-white"
            }`}
          >
            <img
              src={homeIcon}
              alt="Home Icon"
              className={`w-5 h-5 mr-3 transition-colors duration-300 ${
                isActive("/home") ? "text-white" : "text-teal"
              }`}
            />
            <Link to="/home" className="flex-1">
              Home
            </Link>
          </li>
          <li
            className={`flex items-center p-3 rounded-md text-base transition-all duration-300 ${
              isActive("/team-formation")
                ? "bg-peach text-white"
                : "hover:bg-peach hover:text-white"
            }`}
          >
            <img
              src={teamIcon}
              alt="Team Formation Icon"
              className={`w-5 h-5 mr-3 transition-colors duration-300 ${
                isActive("/team-formation") ? "text-white" : "text-teal"
              }`}
            />
            <Link to="/team-formation" className="flex-1">
              Team Formation
            </Link>
          </li>
          <li
            className={`flex items-center p-3 rounded-md text-base transition-all duration-300 ${
              isActive("/settings")
                ? "bg-peach text-white"
                : "hover:bg-peach hover:text-white"
            }`}
          >
            <img
              src={settingsIcon}
              alt="Settings Icon"
              className={`w-5 h-5 mr-3 transition-colors duration-300 ${
                isActive("/settings") ? "text-white" : "text-teal"
              }`}
            />
            <Link to="/settings" className="flex-1">
              Settings
            </Link>
          </li>
          <li
            className={`flex items-center p-3 rounded-md text-base transition-all duration-300 hover:bg-peach hover:text-white`}
            onClick={() => setLogOutOpen(true)}
          >
            <img src={logOutIcon} alt="Log Out Icon" className="w-5 h-5 mr-3" />
            <span className="flex-1 cursor-pointer">Log Out</span>
          </li>
        </ul>
      </div>
      <LogOut
        isOpen={isLogOutOpen}
        onClose={() => setLogOutOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default Navbar;
