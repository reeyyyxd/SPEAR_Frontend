import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../services/AuthContext";
import axios from "axios";
import Navbar from "../../../components/Navbar/Navbar";
import { FiArrowLeft, FiEdit3, FiUserMinus } from "react-icons/fi";

const StudentTeamSettings = () => {
  const { authState, getDecryptedId } = useContext(AuthContext);
  const navigate = useNavigate();

  const classId = getDecryptedId("cid") || authState.classId;
  const userId = authState.uid;

  const [teamDetails, setTeamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState("");
  const [recruitmentOpen, setRecruitmentOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [adviser, setAdviser] = useState("");
  const [schedule, setSchedule] = useState("");
  
  const address = getIpAddress();

  function getIpAddress() {
      const hostname = window.location.hostname;
      const indexOfColon = hostname.indexOf(':');
      return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  useEffect(() => {
    if (!classId || !userId) {
      setLoading(false);
      return;
    }

    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(`http://${address}:8080/team/my/${classId}/${userId}`);
        if (response.status === 200 && response.data) {
          setTeamDetails(response.data);
          setGroupName(response.data.groupName || "");
          setRecruitmentOpen(response.data.recruitmentOpen);
          setAdviser(response.data.adviser || "No adviser assigned");
          setSchedule(response.data.schedule || "No schedule assigned");
        }
      } catch (error) {
        console.error("Error fetching team details:", error);
        setTeamDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [classId, userId]);

  const toggleRecruitment = async () => {
    if (!teamDetails?.tid) return;
    setIsUpdating(true);
    try {
      await axios.put(`http://${address}:8080/student/${teamDetails.tid}/${recruitmentOpen ? "close-recruitment" : "open-recruitment"}`);
      setRecruitmentOpen(!recruitmentOpen);
    } catch (error) {
      console.error("Error updating recruitment status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateGroupName = async () => {
    if (!teamDetails?.tid || !groupName.trim()) return;
    setIsUpdating(true);
    try {
      await axios.put(`http://${address}:8080/student/${teamDetails.tid}/update-group-name`, { groupName });
    } catch (error) {
      console.error("Error updating group name:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const kickMember = async (memberId) => {
    if (!teamDetails?.tid) return;
    try {
      await axios.delete(`http://${address}:8080/team/${teamDetails.tid}/remove-member/${memberId}`);
      setTeamDetails((prev) => ({
        ...prev,
        members: prev.members.filter((id) => id !== memberId),
      }));
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar userRole={authState.role} />

      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-gray-800 transition">
          <FiArrowLeft /> Back
        </button>
        <h2 className="text-xl font-semibold text-teal-700 mb-6">Team Settings</h2>

        {teamDetails ? (
          <div>
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold">Group Name</h3>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="border p-2 w-full rounded-md"
                />
                <button onClick={updateGroupName} className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition" disabled={isUpdating}>
                  <FiEdit3 /> Save
                </button>
              </div>
            </div>

            <div className="mb-6">
              <p><strong>Project Name:</strong> {teamDetails.projectName || "No Project Assigned"}</p>
              <p><strong>Project Description:</strong> {teamDetails.projectDescription || "No Description Available"}</p>
              <p><strong>Team Leader:</strong> {teamDetails.leaderName || "Unknown Leader"}</p>
            </div>

            {/* Adviser & Schedule Section */}
            <div className="mb-6 border p-4 rounded-md bg-gray-100">
              <h3 className="text-lg font-semibold">Team Adviser & Schedule</h3>
              <p><strong>Assigned Adviser:</strong> {adviser}</p>
              <p><strong>Schedule:</strong> {schedule}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <ul className="list-disc pl-6">
                {teamDetails.members && teamDetails.members.length > 0 ? (
                  teamDetails.members.map((member, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-gray-200 rounded-md mb-2">
                      <span>Member ID: {member}</span>
                      <button
                        onClick={() => kickMember(member)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 transition flex items-center gap-1"
                      >
                        <FiUserMinus /> Kick
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-600">No members in the team.</p>
                )}
              </ul>
            </div>

            <div className="mb-6">
              <p className="font-medium">
                <strong>Recruitment Status:</strong>
                <span className={recruitmentOpen ? "text-green-600" : "text-red-500"}> {recruitmentOpen ? "Open" : "Closed"}</span>
              </p>
              <button onClick={toggleRecruitment} className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition" disabled={isUpdating}>
                {recruitmentOpen ? "Close Recruitment" : "Open Recruitment"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">You are not in a team.</p>
        )}
      </div>
    </div>
  );
};

export default StudentTeamSettings;