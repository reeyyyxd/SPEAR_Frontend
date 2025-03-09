import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import MembersTable from "../../../components/Tables/MembersTable";
import axios from "axios";

const StudentClassPage = () => {
  const { authState, storeEncryptedId } = useContext(AuthContext);
  const { courseCode, section } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalMembers, setTotalMembers] = useState(0);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [teacherName, setTeacherName] = useState("");
  const [creatorName, setCreatorName] = useState(""); // Store creator's name

  const address = getIpAddress();

  function getIpAddress() {
    const hostname = window.location.hostname;
    const indexOfColon = hostname.indexOf(":");
    return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  useEffect(() => {
    const fetchClassDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://${address}:8080/class/${courseCode}/${section}`);
        
        if (response.status === 200 && response.data?.classes) {
          const classData = response.data.classes;
          setClassDetails(classData);
          storeEncryptedId("cid", classData.cid);
          fetchTotalMembers(classData.cid);
          
          setTeacherName(classData.teacherName || "Unknown Teacher");
          setCreatorName(
            response.data.createdByFirstname && response.data.createdByLastname
              ? `${response.data.createdByFirstname} ${response.data.createdByLastname}`
              : "Unknown Creator"
          );
  
        } else {
          setClassDetails(null);
        }
      } catch (error) {
        console.error("Error fetching class details:", error);
        setClassDetails(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchClassDetails();
  }, [courseCode, section, storeEncryptedId]);

  const fetchTotalMembers = async (classId) => {
    try {
      const response = await axios.get(`http://${address}:8080/class/${classId}/total-users`);
      if (response.status === 200) {
        setTotalMembers(response.data);
      }
    } catch (error) {
      console.error("Error fetching total members:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://${address}:8080/class/${classDetails.classKey}/students`);
      if (response.status === 200) {
        setStudents(response.data);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
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
      <Navbar userRole={authState.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        {/* Header Section */}
        <div className="header flex justify-between items-center mb-6">
          <div>
            <h1 className="text-lg font-semibold">
              {classDetails.courseCode} - {classDetails.courseDescription} - {classDetails.section}
            </h1>
            <p className="text-sm text-gray-600">
              <strong>Class Creator:</strong> {creatorName}
            </p>
          </div>
          <button
          style={{ backgroundColor: "#323c47", color: "white" }} // Equivalent to teal-600
          className="px-4 py-2 rounded-lg shadow-lg hover:opacity-90 transition-all"
          onClick={fetchStudents}
        >
          Members ({totalMembers})
        </button>
        </div>

        {/* Members Table */}
        <MembersTable />

        {/* Members Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-1/3 relative">
              {/* Header Section */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Class Members</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowModal(false)}
                >
                  ✖
                </button>
              </div>

              {/* Members List */}
              <div className="max-h-60 overflow-y-auto">
                <ul className="space-y-3">
                  {students.slice(0, 10).map((student, index) => (
                    <li key={index} className="border-b pb-2">
                      <p className="text-gray-800 font-medium">
                        {student.firstname} {student.lastname}
                      </p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                      {student.role === "TEACHER" && (
                        <p className="text-xs text-teal-500 font-bold">Teacher</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentClassPage;