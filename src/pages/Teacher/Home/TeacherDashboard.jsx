import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Header from "../../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../services/AuthContext";
import ClassCard from "./ClassCard";

const TeacherDashboard = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState(""); // Store teacher's name
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 6;

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate("/login");
      return;
    }
  
    const fetchDashboardData = async () => {
      try {
        const token = authState.token;
        const userProfileResponse = await fetch(
          `http://localhost:8080/user/profile/${authState.uid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (!userProfileResponse.ok) {
          throw new Error("Failed to fetch user profile.");
        }
  
        const userProfile = await userProfileResponse.json();
        if (userProfile) {
          setTeacherName(`${userProfile.firstname} ${userProfile.lastname}`);
        }
  
        // Fetch classes created by the teacher
        const classesResponse = await fetch(
          `http://localhost:8080/teacher/classes-created/${authState.uid}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        if (!classesResponse.ok) {
          throw new Error("Failed to fetch teacher's classes.");
        }
  
        const classesData = await classesResponse.json();
        setClasses(classesData || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, [authState, navigate]);
  
  const handleCreateClassClick = () => {
    navigate(`/teacher/create-class`);
  };
  
  const handleCardClick = (courseCode, section) => {
    navigate(`/teacher/class/${courseCode}/${section}`);
  };
  

  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClasses = classes.slice(indexOfFirstClass, indexOfLastClass);

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
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        {/* Header Section */}
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">
            Welcome, {teacherName || "Teacher"}
          </h1>
          <Header />
        </div>

        {/* Content Wrapper */}
        <div className="content flex flex-col bg-gray-200 rounded-2xl p-8 min-h-[calc(100vh-8rem)]">
          <button
            onClick={handleCreateClassClick}
            className="joinclass-btn ml-auto w-1/6 h-1/4 bg-teal text-white rounded-lg p-4 text-sm hover:bg-peach"
          >
            Create Class
          </button>

          <div className="classes grid grid-cols-3 gap-12 mt-8">
            {loading ? (
              <p>Loading...</p>
            ) : currentClasses.length > 0 ? (
              currentClasses.map((classData) => (
                <ClassCard
                  key={`${classData.courseCode}-${classData.section}`} // Unique key
                  courseCode={classData.courseCode}
                  section={classData.section}
                  courseDescription={classData.courseDescription}
                  onClick={() => handleCardClick(classData.courseCode, classData.section)}
                />
              ))
            ) : (
              <p>No classes found</p>
            )}
          </div>

          {/* Pagination */}
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
              disabled={currentPage === Math.ceil(classes.length / classesPerPage)}
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
