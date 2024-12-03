import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import ClassService from "../../../services/ClassService";

const ClassPage = () => {
  const { authState } = React.useContext(AuthContext);
  const { courseCode } = useParams();

  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await ClassService.getClassByCourseCode(courseCode);
        setClassDetails(response.classes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching class details:", error);
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [courseCode]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-teal">Loading...</p>
      </div>
    );
  }

  if (!classDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-red-500">
          Class details not found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      {/* Main Content */}
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        {/* Header Section */}
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">
            {" "}
            {classDetails.courseCode} - {classDetails.courseDescription} -{" "}
            {classDetails.section}
          </h1>
        </div>
        {/* Class Details */}
        <div className="bg-gray-100 shadow-md rounded-lg p-6">
          <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-md font-medium text-gray-500">
                Class Key:{" "}
                <span className="text-lg font-medium text-teal">
                  {classDetails.classKey}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
