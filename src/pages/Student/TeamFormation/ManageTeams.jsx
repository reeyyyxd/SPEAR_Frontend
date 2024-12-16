import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";

const ManageTeams = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState?.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        {/* Header Section */}
        <button
          className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-peach hover:text-white"
          onClick={() => navigate(-1)} // Go back to the previous page
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ManageTeams;
