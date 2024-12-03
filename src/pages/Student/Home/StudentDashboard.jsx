import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import ClassService from "../../../services/ClassService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentDashboard = () => {
  const { authState } = useContext(AuthContext);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classKey, setClassKey] = useState("");

  // Fetch enrolled classes
  useEffect(() => {
    const fetchEnrolledClasses = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await ClassService.getClassesForStudent(authState.uid, token);
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

  // Handle enrollment
  const handleEnroll = async () => {
    if (!classKey) {
      toast.error("Please enter a valid class key.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await ClassService.enrollStudentByClassKey(classKey, token);

      if (response && response.statusCode === 200) {
        toast.success("Enrolled successfully!");
        setClassKey(""); // Clear the input field
        // Refresh the list of enrolled classes
        const updatedClasses = await ClassService.getClassesForStudent(authState.uid, token);
        setEnrolledClasses(updatedClasses || []);
      } else {
        toast.error(response.message || "Failed to enroll in class.");
      }
    } catch (error) {
      console.error("Error enrolling in class:", error);
      toast.error("Error enrolling in class. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="p-8 bg-gray-100">
        <h1 className="text-xl font-semibold text-teal mb-6">Student Dashboard</h1>

        {/* Enrollment Section */}
        <div className="enrollment-section bg-white shadow-md p-6 rounded-lg mb-8">
          <h2 className="text-lg font-medium mb-4">Enroll in a Class</h2>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Enter Class Key"
              value={classKey}
              onChange={(e) => setClassKey(e.target.value)}
              className="flex-grow border border-gray-300 rounded-md px-4 py-2 mr-4"
            />
            <button
              onClick={handleEnroll}
              className="bg-teal text-white px-4 py-2 rounded-md hover:bg-peach"
            >
              Enroll
            </button>
          </div>
        </div>

        {/* Enrolled Classes Section */}
        <div className="classes-section bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Your Enrolled Classes</h2>
          {loading ? (
            <p className="text-center text-teal">Loading...</p>
          ) : enrolledClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledClasses.map((classData, index) => (
                <div
                  key={index}
                  className="class-card p-4 border rounded-lg shadow hover:shadow-lg cursor-pointer"
                >
                  <h3 className="text-lg font-semibold text-teal mb-2">
                    {classData.courseCode} - {classData.section}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {classData.courseDescription}
                  </p>
                  <p className="text-sm text-gray-500">
                    Teacher: {classData.firstname} {classData.lastname}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No classes enrolled yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
