import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import ClassService from "../../../services/ClassService";

const ClassPage = () => {
  const { authState, storeEncryptedId } = useContext(AuthContext); // Include storeEncryptedId
  const { courseCode, section } = useParams(); // Extract courseCode and section from URL
  const navigate = useNavigate();

  const [classDetails, setClassDetails] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    const fetchClassDetails = async () => {
      try {
        // Fetch class details by courseCode and section
        const classResponse = await ClassService.getClassByCourseCode(courseCode, section, authState?.token);
        if (!classResponse || !classResponse.classes) {
          setLoading(false);
          return;
        }

        // Set class details
        setClassDetails(classResponse.classes);

        // Store class ID (cid) in localStorage
        storeEncryptedId("cid", classResponse.classes.cid);

        // Fetch total users in class
        const totalUsersResponse = await ClassService.getTotalUsersInClass(classResponse.classes.cid, authState?.token);
        setTotalUsers(totalUsersResponse?.[0]?.[1] || 0);

        // Fetch students in class
        const studentsResponse = await ClassService.getStudentsInClass(classResponse.classes.classKey, authState?.token);
        setStudents(studentsResponse || []);
      } catch (error) {
        console.error("Error fetching class data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [courseCode, section, authState, storeEncryptedId, navigate]);

  const handleKickStudent = async (email) => {
    const confirmRemoval = window.confirm(`Are you sure you want to remove the student with email: ${email}?`);
    if (!confirmRemoval) return;

    try {
      const response = await ClassService.removeStudentFromClass(classDetails.classKey, email, authState?.token);
      if (response.statusCode === 200) {
        alert("Student removed successfully.");
        // Update the students state instead of reloading the page
        setStudents((prevStudents) => prevStudents.filter((student) => student.email !== email));
        setTotalUsers((prevTotal) => prevTotal - 1);
      } else {
        alert(`Failed to remove student: ${response.message}`);
      }
    } catch (error) {
      console.error("Error kicking student:", error);
      alert("An error occurred while trying to remove the student. Please try again.");
    }
  };

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
        <p className="text-lg font-semibold text-red-500">Class details not found.</p>
      </div>
    );
  }


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
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">
            {classDetails.courseCode} - {classDetails.courseDescription} - {classDetails.section}
          </h1>
          <div className="flex space-x-4">
            <button
              className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-peach hover:text-white"
              onClick={() => navigate(`/teacher/project-proposals`)}
            >
              View Project Proposals
            </button>
            <button
              className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-peach hover:text-white"
              onClick={() => navigate(`/teacher/teams`)}
            >
              View Teams
            </button>
            <button
              className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-peach hover:text-white"
              onClick={() => navigate(`/teacher/evaluations`)}
            >
              View Evaluations
            </button>
            <button
              className="text-teal hover:text-teal-dark transition-all duration-300"
              onClick={() => navigate(`/class-settings`)}
            >
              <i className="fas fa-cog text-2xl"></i>
            </button>
          </div>
        </div>

        {/* Class Details */}
        
          <div className="grid grid-cols-4 gap-6 mb-10">
            <div>
              <p className="text-md font-medium text-gray-500">
                Class Key: <span className="text-lg font-medium text-teal">{classDetails.classKey}</span>
              </p>
            </div>
            <div>
              <p className="text-md font-medium text-gray-500">
                Total Enrollees in Class: <span className="text-lg font-medium text-teal">{totalUsers}</span>
              </p>
            </div>
          </div>
        

        {/* Students Table */}
        
          <h2 className="text-lg font-semibold mb-4 text-teal">Enrolled Students</h2>
          {students.length > 0 ? (
            <div className="overflow-y-auto max-h-96 rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="sticky top-0 bg-teal text-white z-20 shadow-lg">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">First Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Last Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student, index) => (
                    <tr key={index} >
                      <td className="px-6 py-4 text-sm text-gray-900">{student.firstname}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{student.lastname}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{student.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{student.role || "Student"}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-lg"
                          onClick={() => handleKickStudent(student.email)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No students enrolled in this class.</p>
          )}
        
      </div>
    </div>
  );
};

export default ClassPage;