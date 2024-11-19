import React, { useContext } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Header from "../../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../services/AuthContext"; 

const TeacherDashboard = () => {
  const { authState } = useContext(AuthContext); // Get the auth state from context
  const navigate = useNavigate();

  if (!authState.isAuthenticated) {
    navigate("/login"); // Redirect to login if not authenticated
  }

  const handleCreateClassClick = () => {
    navigate(`/teacher/create-class`);
  };

  const handleCardClick = (courseCode) => {
    console.log(`Navigating to class with course code: ${courseCode}`);
    navigate(`/class/${courseCode}`);
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      {/* Main Content */}
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        {/* Header Section */}
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">Welcome, teacher</h1>
          <Header />
        </div>

        {/* Content Wrapper */}
        <div className="content flex flex-col bg-gray-200 rounded-2xl p-8 min-h-[calc(100vh-8rem)]">
          {/* Create Class Button */}
          <button
            onClick={handleCreateClassClick}
            className="joinclass-btn ml-auto w-1/6 h-1/4 bg-teal text-white rounded-lg p-4 text-sm hover:bg-peach"
          >
            Create Class
          </button>

          {/* Pagination Buttons */}
          <div className="pagination flex mt-14">
            <button className="w-1/6 h-1/4 bg-slate-100 text-gray-400 rounded-lg p-4 text-sm">
              Prev
            </button>

            <button className="ml-auto w-1/6 h-1/4 bg-slate-100 text-gray-400 rounded-lg p-4 text-sm">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
