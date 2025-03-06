import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../services/AuthContext";
import AddTeamMembersModal from "../Modals/AddTeamMembersModal";
import FormTeamModal from "../Modals/FormTeamModal";
import axios from "axios";

const MembersTable = () => {
  const { authState, getDecryptedId, storeEncryptedId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [teamDetails, setTeamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isFormTeamModalOpen, setIsFormTeamModalOpen] = useState(false);

  const address = getIpAddress();

  function getIpAddress() {
    const hostname = window.location.hostname;
    const indexOfColon = hostname.indexOf(":");
    return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  // Retrieve required IDs
  const classId = getDecryptedId("cid");
  const userId = authState.uid;
  
  // Get teamId from LocalStorage or API response
  const [teamId, setTeamId] = useState(getDecryptedId("tid") || authState.teamId || null);

  const fetchTeamDetails = async () => {
    if (!classId || !userId) {
      console.error("Class ID or User ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const token = authState.token;
      if (!token) {
        console.error("Auth token is missing.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://${address}:8080/team/my/${classId}/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 && response.data) {
        setTeamDetails(response.data);
        const latestTeamId = response.data.tid;
        if (latestTeamId) {
          setTeamId(latestTeamId);
          storeEncryptedId("tid", latestTeamId);
          localStorage.setItem("tid", latestTeamId);
        }
      } else {
        console.warn("No team data received.");
        setTeamDetails(null);
      }
    } catch (error) {
      //console.error("Error fetching team details:", error.response?.data || error.message);
      setTeamDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamDetails();
  }, [authState.uid, classId]);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (!classId || !userId) {
        console.error("Class ID or User ID is missing.");
        setLoading(false);
        return;
      }
    
      setLoading(true);
      try {
        const token = authState.token;
        if (!token) {
          console.error("Auth token is missing.");
          setLoading(false);
          return;
        }
    
        const response = await axios.get(
          `http://${address}:8080/team/my/${classId}/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
    
        if (response.status === 200 && response.data) {
          setTeamDetails(response.data);
          const latestTeamId = response.data.tid;
          if (latestTeamId) {
            setTeamId(latestTeamId);
            storeEncryptedId("tid", latestTeamId);
            localStorage.setItem("tid", latestTeamId);
          }
        } else {
          // Suppress warnings by not logging anything
          setTeamDetails(null);
        }
      } catch (error) {
        if (error.response?.status !== 404) { // Only log actual errors, not "not found"
          //console.error("Error fetching team details:", error.response?.data || error.message);
        }
        setTeamDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [authState.uid, classId]);

  const handleTeamSettingsClick = () => {
    let latestTeamId = getDecryptedId("tid") || teamId;
  
    if (!classId || !latestTeamId || !userId) {
      console.error("Missing parameters for navigation:", { classId, latestTeamId, userId });
      return;
    }
  
    // Store `teamId` securely before navigating
    storeEncryptedId("tid", latestTeamId);
    localStorage.setItem("tid", latestTeamId);
  
    navigate(`/student-team-settings/${classId}/${latestTeamId}/${userId}`);
  };

  const handleAddMembersClick = () => {
    setIsAddMemberModalOpen(true);
  };


  const TABLE_HEAD = ["Group Name", "Recruitment Status", "Leader", "Members", "Adviser & Schedule", " ", " "];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-300 shadow-md mt-16 p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-gray-700 transition"
      >
        Back
      </button>

      <h2 className="text-lg font-semibold text-teal mb-4">Your Team</h2>

      {teamDetails && (
        <button
          onClick={() => setIsAddMemberModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-700 transition"
        >
          Add Members 
        </button>
      )}

      {isAddMemberModalOpen && (
        <AddTeamMembersModal
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
          teamId={teamId}
          classId={classId}
        />
      )}

      {loading ? (
        <p className="text-center text-gray-500 p-4">Loading...</p>
      ) : teamDetails ? (
           
        
        <table className="w-full table-auto text-left border-collapse">
          <thead className="bg-teal text-white">
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th key={`${head}-${index}`} className="p-4 text-sm font-semibold border-b border-gray-300">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            <tr className="hover:bg-peach hover:text-white">
              <td className="p-4 border-b border-gray-300 text-sm">{teamDetails.groupName || "N/A"}</td>
              <td className="p-4 border-b border-gray-300 text-sm">
                <span
                  className={`font-semibold ${
                    teamDetails.recruitmentOpen ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {teamDetails.recruitmentOpen ? "Open" : "Closed"}
                </span>
              </td>
              <td className="p-4 border-b border-gray-300 text-sm">{teamDetails.leaderName || "N/A"}</td>

              {/* Members Column */}
              <td className="p-4 border-b border-gray-300 text-sm">
                {teamDetails.memberNames && teamDetails.memberNames.length > 0 ? (
                  <ul className="list-disc ml-4">
                    {teamDetails.memberNames.map((member, index) => (
                      <li key={index}>{member}</li>  
                    ))}
                  </ul>
                ) : (
                  "No Members"
                )}
              </td>
              
              {/* Adviser & Schedule Column */}
              <td className="p-4 border-b border-gray-300 text-sm">
                <p>
                  <strong>Adviser:</strong> {teamDetails.adviserId ? teamDetails.adviserId : "N/A"}
                </p>
                <p>
                  <strong>Schedule:</strong> {teamDetails.scheduleId ? teamDetails.scheduleId : "Not Assigned"}
                </p>
              </td>
              {/* Project Details Column */}
              <td className="p-4 border-b border-gray-300 text-sm">
                <button
                  onClick={() => setIsProjectModalOpen(true)}
                  className="bg-teal text-white py-2 px-4 rounded-lg hover:bg-peach transition"
                >
                  Project Proposals
                </button>
              </td>
              {/* Actions Button - Redirects to StudentTeamSettings */}
              <td className="p-4 border-b border-gray-300 text-sm">
                <button
                  onClick={handleTeamSettingsClick}
                  className={`bg-teal text-white px-4 py-2 rounded-md transition ${
                    !teamId ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                  }`}
                  disabled={!teamId}
                >
                  Team Settings
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div className="text-gray-500 p-4">
          You have currently no team.{" "}
          <button
            onClick={() => setIsFormTeamModalOpen(true)}
            className="text-teal underline"
          >
            Create a Team
          </button>
          
          {/* Form Team Modal */}
          {isFormTeamModalOpen && (
            <FormTeamModal
              onClose={() => setIsFormTeamModalOpen(false)}
              refreshTeamData={fetchTeamDetails}
            />
          )}{" "}
          or{" "}
          <button
            onClick={() => navigate("/team-formation/apply-to-teams")}
            className="text-teal underline"
          >
            Apply to a Team
          </button>
          </div>
      )}
    </div>
  );
};

export default MembersTable;