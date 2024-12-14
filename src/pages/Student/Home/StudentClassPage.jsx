import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import ClassService from "../../../services/ClassService";
import Guidelines from "../../../components/Statics/Guidelines";
import MembersTable from "../../../components/Tables/MembersTable";

const StudentClassPage = () => {
  const { authState, storeEncryptedId } = useContext(AuthContext); // AuthContext for storing class ID
  const { courseCode, section } = useParams(); // Include section
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassDetails = async () => {
      setLoading(true);
      try {
        // Fetch class details by courseCode and section
        const response = await ClassService.getClassByCourseCodeStudent(courseCode, section);
        if (response?.classes) {
          setClassDetails(response.classes);
          storeEncryptedId("cid", response.classes.cid); // Store class ID securely
        } else {
          setClassDetails(null);
        }
      } catch (error) {
        console.error("Error fetching class details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [courseCode, section, storeEncryptedId]);

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
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        {/* Header Section */}
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">
            {classDetails.courseCode} - {classDetails.courseDescription} - {classDetails.section}
          </h1>
        </div>

        <Guidelines />

        {/* Action Buttons */}
        <div className="actions text-end mt-8">
          {/* Propose Project Button */}
          <Link
            to="/team-formation/project-proposal"
            className="w-1/6 h-1/4 bg-teal text-white rounded-lg p-4 text-sm text-center hover:bg-peach"
          >
            Propose Project
          </Link>
          {/* Evaluate Peers Button */}
          <Link
            to={`/class/${courseCode}/evaluate-peers`}
            className="w-1/6 h-1/4 ml-4 bg-teal text-white rounded-lg p-4 text-sm text-center hover:bg-peach"
          >
            Evaluate Peers
          </Link>
        </div>

        {/* Members Table */}
        <MembersTable />
      </div>
    </div>
  );
};

export default StudentClassPage;
