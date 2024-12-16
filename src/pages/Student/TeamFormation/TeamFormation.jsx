import React, { useContext } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import { useNavigate } from "react-router-dom";

const TeamFormation = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      {/* Main Content */}
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        {/* Header Section */}
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">
            Welcome to SPEAR'S team formation
          </h1>
        </div>

        {/* Guidelines Section */}
        <div className="guidelines mb-8">{/* Forms here */}</div>
      </div>
    </div>
  );
};

export default TeamFormation;
