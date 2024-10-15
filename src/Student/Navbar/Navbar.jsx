import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "./imgs/logo.png";
import homeIcon from "./imgs/home-icon.svg";
import teamIcon from "./imgs/team-icon.svg";
import settingsIcon from "./imgs/settings-icon.svg";
import logOutIcon from "./imgs/log-out-icon.svg";

const Navbar = () => {
  const location = useLocation(); // Get the current route

  // Function to determine if the link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="navbar h-screen w-64 bg-teal text-white p-6 flex flex-col items-center">
      <div className="flex items-center mb-8">
        <img src={logo} alt="Company Logo" className="w-24 h-auto rounded-md" />
      </div>
      <ul className="mt-10 space-y-10">
        {/** Nav Items */}
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
          className={`flex items-center p-3 rounded-md text-base transition-all duration-300 ${
            isActive("/log-out")
              ? "bg-peach text-white"
              : "hover:bg-peach hover:text-white"
          }`}
        >
          <img
            src={logOutIcon}
            alt="Log Out Icon"
            className={`w-5 h-5 mr-3 transition-colors duration-300 ${
              isActive("/log-out") ? "text-white" : "text-teal"
            }`}
          />
          <Link to="/log-out" className="flex-1">
            Log Out
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
