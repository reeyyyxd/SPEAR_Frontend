import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Header from "../../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../services/AuthContext";
import ClassCard from "./ClassCard";
import ClassService from "../../../services/ClassService"; // Import ClassService

const TeacherDashboard = () => {
  const { authState } = useContext(AuthContext); // Get the auth state from context
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true); // Loading state
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const [classesPerPage] = useState(6); // Number of classes to display per page

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate("/login"); // Redirect to login if not authenticated
    }

    const fetchClasses = async () => {
      try {
        const response = await ClassService.getClassesCreatedByUser(
          authState.uid
        );
        setClasses(response || []); // Set the classes from the response
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching classes:", error);
        setClasses([]); // In case of an error, set to empty array
        setLoading(false);
      }
    };

    fetchClasses();
  }, [authState, navigate]);

  const handleCreateClassClick = () => {
    navigate(`/teacher/create-class`);
  };

  const handleCardClick = (courseCode) => {
    navigate(`/class/${courseCode}`);
  };

  // Get the classes to display for the current page
  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClasses = classes.slice(indexOfFirstClass, indexOfLastClass);

  // Change page
  const nextPage = () => {
    if (currentPage < Math.ceil(classes.length / classesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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

          <div className="classes grid grid-cols-3 gap-12 mt-8">
            {loading ? (
              <p>Loading...</p> // Show loading text while fetching classes
            ) : Array.isArray(currentClasses) && currentClasses.length > 0 ? (
              currentClasses.map((classData) => (
                <ClassCard
                  key={classData.courseCode} // Use courseCode as the key
                  courseCode={classData.courseCode} // Pass courseCode
                  section={classData.section}
                  courseDescription={classData.courseDescription} // Pass courseDescription
                  onClick={() => handleCardClick(classData.courseCode)} // Click handler
                />
              ))
            ) : (
              <p>No classes found</p> // Show message if no classes are available
            )}
          </div>

          {/* Pagination Buttons */}
          <div className="pagination flex mt-14">
            <button
              onClick={prevPage}
              className="w-1/6 h-1/4 bg-slate-100 text-gray-400 rounded-lg p-4 text-sm"
              disabled={currentPage === 1} // Disable prev button on the first page
            >
              Prev
            </button>

            <button
              onClick={nextPage}
              className="ml-auto w-1/6 h-1/4 bg-slate-100 text-gray-400 rounded-lg p-4 text-sm"
              disabled={
                currentPage === Math.ceil(classes.length / classesPerPage)
              } // Disable next button on last page
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
