import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../services/AuthContext";
import axios from "axios";
import Navbar from "../../../components/Navbar/Navbar";
import { FiArrowLeft, FiEdit3, FiUserMinus, FiChevronDown, FiUserCheck} from "react-icons/fi";

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
  const [advisers, setAdvisers] = useState([]);
  const [adviserLoading, setAdviserLoading] = useState(false);
  const [selectedAdviser, setSelectedAdviser] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showAdviserDropdown, setShowAdviserDropdown] = useState(false);
  const [showScheduleDropdown, setShowScheduleDropdown] = useState(false);
  const [error, setError] = useState("");

  
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
          const teamData = response.data;
          setTeamDetails(teamData);
          setGroupName(teamData.groupName || "");
          setRecruitmentOpen(teamData.recruitmentOpen);

          if (teamData.adviserId) {
            setSelectedAdviser(teamData.adviserId);
            fetchSchedules(teamData.adviserId);
          }

          if (teamData.scheduleId) {
            setSelectedSchedule(teamData.scheduleId);
          }
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

  const fetchAdvisers = async () => {
    setShowAdviserDropdown((prev) => !prev);
    setError("");

    if (advisers.length > 0) return;

    try {
      const response = await axios.get(`http://${address}:8080/class/${classId}/qualified-teachers`);
      if (response.status === 200) {
        setAdvisers(response.data);
      }
    } catch (error) {
      console.error("Error fetching advisers:", error);
      setError("Failed to fetch advisers.");
    }
  };

  const fetchSchedules = async (adviserId) => {
    setError("");
    setShowScheduleDropdown(false);
    setSchedules([]);

    if (!adviserId || !classId) {
      console.error("Invalid adviser ID or class ID");
      setError("Invalid adviser or class information.");
      return;
    }

    try {
      const response = await axios.get(`http://${address}:8080/adviser/${adviserId}/available-schedules/${classId}`);
      if (response.status === 200 && response.data.length > 0) {
        setSchedules(response.data);
      } else {
        setSchedules([]);
        setError("No schedules available for this adviser.");
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setError(error.response?.data?.message || "Failed to fetch schedules.");
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
  
    const [hour, minute] = timeString.split(":");
    let formattedHour = parseInt(hour, 10);
    const ampm = formattedHour >= 12 ? "PM" : "AM";
  
    if (formattedHour > 12) formattedHour -= 12;
    if (formattedHour === 0) formattedHour = 12;
  
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const assignAdviserAndSchedule = async () => {
    if (!selectedAdviser || !selectedSchedule || !teamDetails?.tid) return;
  
    setIsUpdating(true);
    setError("");
  
    try {
      const response = await axios.put(
        `http://${address}:8080/team/${teamDetails.tid}/assign-adviser-schedule`,
        {
          adviserId: selectedAdviser,
          scheduleId: selectedSchedule,
          requesterId: userId, 
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      alert(response.data.message);
  
      // Fetch the updated team details
      window.location.reload();
  
    } catch (error) {
      console.error("Error assigning adviser and schedule:", error);
      setError(error.response?.data?.error || "Failed to assign.");
    } finally {
      setIsUpdating(false);
    }
  };


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
  
      // Refresh UI after leaving the team
      window.location.reload();
  
    } catch (error) {
      console.error("Error leaving team:", error.response?.data?.error || error.message);
      alert(error.response?.data?.error || "Failed to leave the team.");
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


const transferLeadership = async (newLeaderId) => {
  if (!teamDetails?.tid) return;

  if (!window.confirm("Are you sure you want to transfer leadership?")) {
    return;
  }

  try {
    const response = await axios.put(
      `http://${address}:8080/team/${teamDetails.tid}/transfer-leadership`,
      {
        requesterId: userId,
        newLeaderId: newLeaderId,
      }
    );
    alert(response.data.message);
    window.location.reload();
  } catch (error) {
    console.error("Error transferring leadership:", error);
    alert(error.response?.data?.message || "Failed to transfer leadership.");
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar userRole={authState.role} />
  
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg mb-4 hover:bg-gray-500 transition"
        >
          <FiArrowLeft />
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
                  className="border border-gray-300 px-3 py-2 rounded-md hover:bg-gray-200 transition"
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
                        <td className="border border-gray-300 px-4 py-3 text-gray-800">{member}</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex flex-wrap gap-2 justify-center">
                            <button
                              onClick={() => kickMember(teamDetails.memberIds[index])}
                              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition flex items-center gap-2"
                            >
                              <FiUserMinus /> Kick
                            </button>
                            <button
                              onClick={() => transferLeadership(teamDetails.memberIds[index])}
                              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2"
                            >
                              <FiUserCheck /> Transfer Leadership
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600">No members in the team.</p>
              )}
            </div>

            <div className="mb-4 p-4 border rounded-md bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Current Adviser & Schedule</h3>
            <p className="text-gray-700"><strong>Adviser:</strong> {teamDetails?.adviserName || "Not Assigned"}</p>
            <p className="text-gray-700"><strong>Schedule:</strong> 
              {teamDetails?.scheduleDay && teamDetails?.scheduleTime
                ? `${teamDetails.scheduleDay}, ${teamDetails.scheduleTime}`
                : "Not Assigned"}
            </p>
          </div>

  
          {/* Adviser & Schedule Section */}
        <div className="mb-6 border p-4 rounded-md bg-gray-100 relative">
          <h3 className="text-lg font-semibold">Assign or Change Adviser & Schedule</h3>

          {/* Adviser Selection */}
          <div className="mt-2">
            <label className="block font-medium mb-1">Select Adviser:</label>
            <button
              onClick={fetchAdvisers}
              className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-md w-full text-left flex justify-between items-center"
            >
              {selectedAdviser
                ? advisers.find((a) => a.uid === selectedAdviser)?.firstname + " " + advisers.find((a) => a.uid === selectedAdviser)?.lastname
                : "Select an Adviser"}
              <FiChevronDown className="ml-2 transition-transform duration-200" />
            </button>

            {showAdviserDropdown && advisers.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full shadow-lg max-h-48 overflow-auto text-gray-900">
                {advisers.map((adv) => (
                  <li
                    key={adv.uid}
                    className="p-3 hover:bg-blue-100 cursor-pointer transition"
                    onClick={() => {
                      setSelectedAdviser(adv.uid);
                      setShowAdviserDropdown(false);
                      fetchSchedules(adv.uid);
                    }}
                  >
                    {adv.firstname} {adv.lastname} - {adv.interests}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Schedule Selection */}
          {selectedAdviser && (
            <div className="mt-4">
              <label className="block font-medium mb-1">Select Schedule:</label>
              <button
                onClick={() => setShowScheduleDropdown((prev) => !prev)}
                className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-md w-full text-left flex justify-between items-center"
              >
                {selectedSchedule
                  ? schedules.find((s) => s.schedid === selectedSchedule)?.day + " - " +
                    formatTime(schedules.find((s) => s.schedid === selectedSchedule)?.startTime) + " - " +
                    formatTime(schedules.find((s) => s.schedid === selectedSchedule)?.endTime)
                  : schedules.length > 0 
                    ? "Select a Schedule" 
                    : "No Available Schedules"}
                <FiChevronDown className="ml-2 transition-transform duration-200" />
              </button>

              {showScheduleDropdown && schedules.length > 0 && (
               <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full shadow-lg max-h-48 overflow-auto text-gray-900">
               {schedules.map((sched) => (
                 <li
                   key={sched.schedid}
                   className="p-3 hover:bg-blue-100 cursor-pointer transition"
                   onClick={() => {
                     setSelectedSchedule(sched.schedid);
                     setShowScheduleDropdown(false);
                   }}
                 >
                   {sched.day} - {formatTime(sched.startTime)} - {formatTime(sched.endTime)}
                 </li>
               ))}
             </ul>
              )}
            </div>
          )}

          {/* Assign Button */}
          <button
            onClick={assignAdviserAndSchedule}
            className={`mt-3 px-4 py-2 w-full rounded-lg transition ${
              isUpdating || !selectedAdviser || !selectedSchedule
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
            disabled={isUpdating || !selectedAdviser || !selectedSchedule}
          >
            {isUpdating ? "Assigning..." : "Assign Adviser & Schedule"}
          </button>
        </div>
  

            {/* Recruitment Status */}
            <div className="mb-6">
              <p className="font-medium">
                <strong>Recruitment Status:</strong>
                <span className={recruitmentOpen ? "text-green-600" : "text-red-500"}> {recruitmentOpen ? "Open" : "Closed"}</span>
              </p>
              <button
                onClick={toggleRecruitment}
                className="mt-2 px-4 py-2 w-full bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
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