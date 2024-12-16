import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import JoinClassModal from "../../../components/Modals/JoinClassModal";
import AuthContext from "../../../services/AuthContext";
import ClassService from "../../../services/ClassService";
import UserService from "../../../services/UserService";
import ClassCard from "./ClassCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentDashboard = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [studentName, setStudentName] = useState(""); // Student name state
  const [currentPage, setCurrentPage] = useState(1);
  const [classesPerPage] = useState(6);

  // Fetch enrolled classes and student profile
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        // Fetch enrolled classes
        const response = await ClassService.getClassesForStudent(
          authState.uid,
          token
        );
        setEnrolledClasses(response || []);

        // Fetch student's name
        const userProfile = await UserService.getUserProfileById(authState.uid);
        if (userProfile) {
          setStudentName(`${userProfile.firstname} ${userProfile.lastname}`);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    if (authState.isAuthenticated) {
      fetchDashboardData();
    }
  }, [authState]);

  // Modal Handlers
  const handleJoinClassClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Navigation for Class Cards
  const handleCardClick = (courseCode, section) => {
    navigate(`/class/${courseCode}/${section}`);
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
    <div className="grid grid-cols-1 md:grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="main-content bg-white text-teal px-6 sm:px-12 md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="header flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-lg font-semibold">
            Welcome, {studentName || "Student"}
          </h1>
        </div>
        <div className="content flex flex-col bg-gray-200 rounded-2xl p-6 sm:p-8 min-h-[calc(100vh-8rem)]">
          <button
            onClick={handleJoinClassClick}
            className="joinclass-btn self-center sm:self-end w-full sm:w-1/2 md:w-1/6 bg-teal text-white rounded-lg py-2 px-4 text-sm hover:bg-peach transition-all"
          >
            Join Class
          </button>
          <div className="classes grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mt-8">
            {loading ? (
              <p className="text-center text-teal">Loading...</p>
            ) : Array.isArray(currentClasses) && currentClasses.length > 0 ? (
              currentClasses.map((classData, index) => (
                <ClassCard
                  key={index}
                  courseCode={classData.courseCode}
                  section={classData.section}
                  courseDescription={classData.courseDescription}
                  teacherName={`${classData.firstname} ${classData.lastname}`}
                  onClick={() =>
                    handleCardClick(classData.courseCode, classData.section)
                  }
                />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No classes enrolled yet.
              </p>
            )}
          </div>
          <div className="pagination flex mt-14">
            <button
              onClick={prevPage}
              className="w-full sm:w-1/3 md:w-1/6 bg-slate-100 text-gray-400 rounded-lg py-2 px-4 text-sm"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              onClick={nextPage}
              className="ml-auto w-full sm:w-1/3 md:w-1/6 bg-slate-100 text-gray-400 rounded-lg py-2 px-4 text-sm"
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
            throw error;
          }
        }}
      />
    </div>
  );
};
export default StudentDashboard;
