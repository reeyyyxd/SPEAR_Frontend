import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import JoinClassModal from "../../../components/Modals/JoinClassModal";
import AuthContext from "../../../services/AuthContext";
import ClassService from "../../../services/ClassService";
import ClassCard from "./ClassCard"; // Import the ClassCard component
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentDashboard = () => {
  const { authState } = useContext(AuthContext);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [classesPerPage] = useState(6); // Classes per page

  // Fetch enrolled classes
  useEffect(() => {
    const fetchEnrolledClasses = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await ClassService.getClassesForStudent(
          authState.uid,
          token
        );
        setEnrolledClasses(response || []);
      } catch (error) {
        console.error("Error fetching enrolled classes:", error);
        toast.error("Failed to fetch enrolled classes.");
      } finally {
        setLoading(false);
      }
    };

    if (authState.isAuthenticated) {
      fetchEnrolledClasses();
    }
  }, [authState]);

  // Modal Handlers
  const handleJoinClassClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Pagination Logic
  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClasses = enrolledClasses.slice(
    indexOfFirstClass,
    indexOfLastClass
  );

  const nextPage = () => {
    if (currentPage < Math.ceil(enrolledClasses.length / classesPerPage)) {
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
          <h1 className="text-lg font-semibold">Welcome, Student</h1>
        </div>

        {/* Content Wrapper */}
        <div className="content flex flex-col bg-gray-200 rounded-2xl p-8 min-h-[calc(100vh-8rem)]">
          {/* Join Class Button */}
          <button
            onClick={handleJoinClassClick}
            className="joinclass-btn ml-auto w-1/6 h-1/4 bg-teal text-white rounded-lg p-4 text-sm hover:bg-peach"
          >
            Join Class
          </button>

          {/* Enrolled Classes Section */}
          <div className="classes grid grid-cols-3 gap-12 mt-8">
            {loading ? (
              <p className="text-center text-teal">Loading...</p>
            ) : Array.isArray(currentClasses) && currentClasses.length > 0 ? (
              currentClasses.map((classData, index) => (
                <ClassCard
                  key={index}
                  courseCode={classData.courseCode}
                  section={classData.section}
                  courseDescription={classData.courseDescription}
                  teacherName={`${classData.firstname} ${classData.lastname}`} // Combine first and last name
                  onClick={() =>
                    console.log(`Navigating to class: ${classData.courseCode}`)
                  } // Add navigation or other logic for class cards
                />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No classes enrolled yet.
              </p>
            )}
          </div>

          {/* Pagination Buttons */}
          <div className="pagination flex mt-14">
            <button
              onClick={prevPage}
              className="w-1/6 h-1/4 bg-slate-100 text-gray-400 rounded-lg p-4 text-sm"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              onClick={nextPage}
              className="ml-auto w-1/6 h-1/4 bg-slate-100 text-gray-400 rounded-lg p-4 text-sm"
              disabled={
                currentPage ===
                Math.ceil(enrolledClasses.length / classesPerPage)
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Join Class Modal */}
      <JoinClassModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEnroll={async (classKey) => {
          const token = localStorage.getItem("token");
          try {
            const response = await ClassService.enrollStudentByClassKey(
              classKey,
              token
            );
            if (response && response.statusCode === 200) {
              toast.success("Enrolled successfully!");
              // Refresh enrolled classes
              const updatedClasses = await ClassService.getClassesForStudent(
                authState.uid,
                token
              );
              setEnrolledClasses(updatedClasses || []);
            } else {
              toast.error(response.message || "Failed to enroll in class.");
            }
          } catch (error) {
            console.error("Error enrolling in class:", error);
            throw error; // Re-throw for modal to handle
          }
        }}
      />
    </div>
  );
};

export default StudentDashboard;
