import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../../services/AuthContext";
import Navbar from "../../../components/Navbar/Navbar";
import TeamService from "../../../services/TeamService";

const ManageTeamsPage = () => {
  const { authState } = useContext(AuthContext);
  const { tid } = useParams(); // Extract `tid` from the URL
  const [teamDetails, setTeamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setLoading(true);
        const response = await TeamService.getTeamById(tid, authState.token);
        console.log("API Response:", response); // Debugging: Inspect response
        setTeamDetails(response);
      } catch (err) {
        console.error("Error fetching team details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [tid, authState.token]);

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState?.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <button
          className="bg-teal text-white px-4 py-2 my-8 rounded-lg hover:bg-peach hover:text-white"
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        {loading ? (
          <p>Loading team details...</p>
        ) : teamDetails ? (
          <div>
            <h1 className="text-lg font-semibold mb-4">
              Team: {teamDetails.groupName}
            </h1>
            <p>Project ID: {teamDetails.projectId}</p>
            <p>Leader ID: {teamDetails.leaderId}</p>
            <p>Class ID: {teamDetails.classId}</p>
            <p>Status: {teamDetails.recruitmentOpen ? "ACTIVE" : "INACTIVE"}</p>
          </div>
        ) : (
          <p>No details available for this team.</p>
        )}
      </div>
    </div>
  );
};

export default ManageTeamsPage;
