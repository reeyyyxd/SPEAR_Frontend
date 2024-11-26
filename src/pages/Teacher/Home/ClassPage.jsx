import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import ClassService from "../../../services/ClassService";

const ClassPage = () => {
  const { authState } = useContext(AuthContext); // Get auth state from context
  const navigate = useNavigate(); // Navigation hook
  const { courseCode } = useParams(); // Extract courseCode from URL using useParams
  const [classData, setClassData] = useState(null); // State to store fetched class details
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch class details when the component mounts
  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate("/login"); // Redirect to login if user is not authenticated
    }

    const fetchClass = async () => {
      try {
        const response = await ClassService.getClassByCode(courseCode);
        console.log("API Response:", response); // Log API response
        setClassData(response || {}); // Set the fetched class data
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching class:", error);
        setClassData(null); // Set to null if there's an error
        setLoading(false); // Set loading to false after error
      }
    };

    fetchClass(); // Call the fetch function
  }, [authState, navigate, courseCode]);

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      {/* Main Content */}
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12 font-medium">
        <h1 className="text-2xl font-semibold mb-6">Class Page</h1>
        <h2 className="text-lg"> {courseCode}</h2>
      </div>
    </div>
  );
};

export default ClassPage;
