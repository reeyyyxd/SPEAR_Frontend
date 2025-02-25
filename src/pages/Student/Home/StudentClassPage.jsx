import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import MembersTable from "../../../components/Tables/MembersTable";
import axios from "axios";

const StudentClassPage = () => {
  const { authState, storeEncryptedId } = useContext(AuthContext);
  const { courseCode, section } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/class/${courseCode}/${section}`
        );
        
        if (response.status === 200 && response.data?.classes) {
          setClassDetails(response.data.classes);
          storeEncryptedId("cid", response.data.classes.cid);
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
            {classDetails.courseCode} - {classDetails.courseDescription} -{" "}
            {classDetails.section}
          </h1>
        </div>
        <MembersTable />
      </div>
    </div>
  );
};

export default StudentClassPage;
