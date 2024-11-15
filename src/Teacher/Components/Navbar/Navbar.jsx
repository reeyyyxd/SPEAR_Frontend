import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "./imgs/logo.png";
import homeIcon from "./imgs/home-icon.svg";
import proposalsIcon from "./imgs/proposals-icon.svg";
import settingsIcon from "./imgs/settings-icon.svg";
import logOutIcon from "./imgs/log-out-icon.svg";
import LogOut from "../../../Student/Pages/UserManagment/LogOut";

const Navbar = () => {
  const location = useLocation();
  const [isLogOutOpen, setLogOutOpen] = useState(false); // State for the logout modal

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    console.log("User logged out");
    setLogOutOpen(false);
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
              isActive("/teacher/home")
                ? "bg-peach text-white"
                : "hover:bg-peach hover:text-white"
            }`}
          >
            <img
              src={homeIcon}
              alt="Home Icon"
              className={`w-5 h-5 mr-3 transition-colors duration-300 ${
                isActive("/teacher/home") ? "text-white" : "text-teal"
              }`}
            />
            <Link to="/teacher/home" className="flex-1">
              Home
            </Link>
          </li>
          <li
            className={`flex items-center p-3 rounded-md text-base transition-all duration-300 ${
              isActive("/teacher/project-proposals")
                ? "bg-peach text-white"
                : "hover:bg-peach hover:text-white"
            }`}
          >
            <img
              src={proposalsIcon}
              alt="Team Formation Icon"
              className={`w-5 h-5 mr-3 transition-colors duration-300 ${
                isActive("/teacher/project-proposals")
                  ? "text-white"
                  : "text-teal"
              }`}
            />
            <Link to="/teacher/project-proposals" className="flex-1">
              Project Proposals
            </Link>
          </li>
          <li
            className={`flex items-center p-3 rounded-md text-base transition-all duration-300 ${
              isActive("/teacher/settings")
                ? "bg-peach text-white"
                : "hover:bg-peach hover:text-white"
            }`}
          >
            <img
              src={settingsIcon}
              alt="Settings Icon"
              className={`w-5 h-5 mr-3 transition-colors duration-300 ${
                isActive("/teacher/settings") ? "text-white" : "text-teal"
              }`}
            />
            <Link to="/teacher/settings" className="flex-1">
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
