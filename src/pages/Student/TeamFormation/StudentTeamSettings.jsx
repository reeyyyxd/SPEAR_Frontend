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
      await axios.put(
        `http://${address}:8080/student/${teamDetails.tid}/${recruitmentOpen ? "close-recruitment" : "open-recruitment"}`,
        { requesterId: userId } // Include the leader's ID
      );
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
      await axios.put(`http://${address}:8080/student/${teamDetails.tid}/update-group-name`, {
        groupName,
        requesterId: userId,
      });
    } catch (error) {
      console.error("Error updating group name:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const kickMember = async (memberId) => {
    if (!teamDetails?.tid) return;
    try {
      await axios.delete(`http://${address}:8080/student/${teamDetails.tid}/kick-member/${memberId}`, {
        data: { requesterId: userId },
      });
  
      setTeamDetails((prev) => ({
        ...prev,
        memberIds: prev.memberIds.filter((id) => id !== memberId),
        memberNames: prev.memberNames.filter((_, index) => prev.memberIds[index] !== memberId),
      }));
      window.location.reload(); 
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const leaveTeam = async () => {
    if (!teamDetails?.tid) return;
  
    try {
      const response = await axios.delete(`http://${address}:8080/team/${teamDetails.tid}/leave`, {
        params: { userId }
      });
  
      alert(response.data.message);
      navigate("/student-dashboard"); // Redirect user to another page after leaving
    } catch (error) {
      console.error("Error leaving team:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Failed to leave the team.");
    }
  };
  
  const deleteTeam = async () => {
    if (!teamDetails?.tid) return;

    if (!window.confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
        return;
    }

    try {
        const response = await axios.delete(`http://${address}:8080/student/delete-team/${teamDetails.tid}/requester/${userId}`);

        alert(response.data.message);
        navigate("/student-dashboard");
    } catch (error) {
        console.error("Error deleting team:", error.response?.data?.message || error.message);
        alert(error.response?.data?.message || "Failed to delete the team.");
    }
};

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar userRole={authState.role} />
  
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-gray-800 transition"
        >
          <FiArrowLeft /> Back
        </button>
  
        <h2 className="text-xl font-semibold text-teal-700 mb-6">Team Settings</h2>
  
        {teamDetails ? (
          <div>
            {/* Change Group Name */}
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold">Change Group Name</h3>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="border p-2 w-full rounded-md"
                />
                <button
                  onClick={updateGroupName}
                  className="bg-black-500 text-black px-3 py-2 rounded-md hover:bg-black-700 transition"
                  disabled={isUpdating}
                >
                  Save
                </button>
              </div>
            </div>
  
            {/* Team Leader */}
            <div className="mb-6">
              <p><strong>Team Leader:</strong> {teamDetails.leaderName || "Unknown Leader"}</p>
            </div>
  
            {/* Team Members */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Team Members</h3>
              {teamDetails.memberNames && teamDetails.memberNames.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-4 py-2 text-left">Member Name</th>
                      <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamDetails.memberNames.map((member, index) => (
                      <tr key={teamDetails.memberIds[index]} className="hover:bg-gray-100">
                        <td className="border border-gray-300 px-4 py-2">{member}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <button
                            onClick={() => kickMember(teamDetails.memberIds[index])}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 transition flex items-center gap-1"
                          >
                            <FiUserMinus /> Kick
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600">No members in the team.</p>
              )}
            </div>
  
            {/* Adviser & Schedule Section */}
            <div className="mb-6 border p-4 rounded-md bg-gray-100">
              <h3 className="text-lg font-semibold">Team Adviser & Schedule</h3>
              <div className="mt-2">
                <label className="block font-medium">Assigned Adviser:</label>
                <input
                  type="text"
                  value={adviser}
                  onChange={(e) => setAdviser(e.target.value)}
                  className="border p-2 w-full rounded-md"
                />
              </div>
              <div className="mt-2">
                <label className="block font-medium">Schedule:</label>
                <select
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="border p-2 w-full rounded-md"
                >
                  <option value="">Select Schedule</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>
            </div>
  
            {/* Recruitment Status */}
            <div className="mb-6">
              <p className="font-medium">
                <strong>Recruitment Status:</strong>
                <span className={recruitmentOpen ? "text-green-600" : "text-red-500"}> {recruitmentOpen ? "Open" : "Closed"}</span>
              </p>
              <button
                onClick={toggleRecruitment}
                className="mt-2 px-4 py-2 w-full bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                disabled={isUpdating}
              >
                {recruitmentOpen ? "Close Recruitment" : "Open Recruitment"}
              </button>
            </div>
  
            {/* Leave Team & Delete Team Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={leaveTeam}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Leave Team
              </button>
              {authState.userId === teamDetails.leaderId && (
                <button
                  onClick={deleteTeam}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 transition"
                >
                  Delete Team
                </button>
              )}
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