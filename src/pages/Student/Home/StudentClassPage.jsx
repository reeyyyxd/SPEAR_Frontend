import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import ClassService from "../../../services/ClassService";
import Guidelines from "../../../components/Statics/Guidelines";
import MembersTable from "../../../components/Tables/MembersTable";
import { Link } from "react-router-dom";

const StudentClassPage = () => {
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
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">
            {" "}
            {classDetails.courseCode} - {classDetails.courseDescription} -{" "}
            {classDetails.section}
          </h1>
        </div>
        <Guidelines />
        <MembersTable />
        <div className="evaluate-btn flex mt-14">
          <Link
            to={`/class/${courseCode}/evaluate-peers`} // Dynamic route with courseCode
            className="ml-auto w-1/6 h-1/4 bg-teal text-white rounded-lg p-4 text-sm text-center hover:bg-peach"
          >
            Evaluate Peers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentClassPage;
