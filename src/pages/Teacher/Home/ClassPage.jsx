import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import ClassService from "../../../services/ClassService";

const ClassPage = () => {
  const { authState } = useContext(AuthContext);
  const { courseCode } = useParams();

  const [classDetails, setClassDetails] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch class data from backend
  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const classResponse = await ClassService.getClassByCourseCode(courseCode, authState?.token);
        
        if (!classResponse || !classResponse.classes) {
          setLoading(false);
          return;
        }
  
        setClassDetails(classResponse.classes);
  
        const totalUsersResponse = await ClassService.getTotalUsersInClass(classResponse.classes.cid, authState?.token);
        if (!totalUsersResponse || totalUsersResponse.length === 0) {
          setTotalUsers(0);
        } else {
          setTotalUsers(totalUsersResponse[0][1] || 0);
        }
  
        const studentsResponse = await ClassService.getStudentsInClass(classResponse.classes.classKey, authState?.token);
        if (!studentsResponse || studentsResponse.length === 0) {
          setStudents([]);
        } else {
          setStudents(studentsResponse);
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchClassDetails();
  }, [courseCode, authState?.token]);

  const handleKickStudent = async (email) => {
    try {
      const response = await ClassService.removeStudentFromClass(classDetails.classKey, email);
      if (response.statusCode === 200) {
        alert("Student removed successfully.");
        // Re-fetch students after kicking
        const updatedStudentsResponse = await ClassService.getStudentsInClass(classDetails.classKey, authState?.token);
        setStudents(updatedStudentsResponse);
      } else {
        alert(`Failed to remove student: ${response.message}`);
      }
    } catch (error) {
      console.error("Error kicking student:", error);
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
        <p className="text-lg font-semibold text-red-500">
          Class details not found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState?.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        {/* Header Section */}
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">
            {classDetails.courseCode} - {classDetails.courseDescription} - {classDetails.section}
          </h1>
        </div>

        {/* Class Details */}
        <div className="bg-gray-100 shadow-md rounded-lg p-6">
          <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-md font-medium text-gray-500">
                Class Key:{" "}
                <span className="text-lg font-medium text-teal">{classDetails.classKey}</span>
              </p>
            </div>
            <div>
              <p className="text-md font-medium text-gray-500">
                Total Enrollees in Class:{" "}
                <span className="text-lg font-medium text-teal">{totalUsers}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-gray-100 shadow-md rounded-lg p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Enrolled Students</h2>
          {students.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-teal-500 text-white">
                  <th className="px-6 py-3 text-left text-sm font-bold text-black">First Name</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-black">Last Name</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-black">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-black">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-black">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-gray-900">{student.firstname}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{student.lastname}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{student.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{student.role || "Student"}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        onClick={() => handleKickStudent(student.email)}
                      >
                        Kick
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No students enrolled in this class.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
