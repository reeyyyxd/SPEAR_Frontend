import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../services/AuthContext";
import axios from "axios";
import Navbar from "../../../components/Navbar/Navbar";
import {
  FiArrowLeft,
  FiEdit3,
  FiUserMinus,
  FiChevronDown,
  FiUserCheck,
} from "react-icons/fi";
import { Crown, UserMinus } from "lucide-react";
import StudentAdvisoryRequestModal from "../../../components/Modals/StudentAdvisoryRequestModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [error, setError] = useState("");
  const [showDropModal, setShowDropModal] = useState(false);
  const [dropReason, setDropReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [userData, setUserData] = useState({ firstname: "", lastname: "" });

  const address = getIpAddress();

  function getIpAddress() {
    const hostname = window.location.hostname;
    const indexOfColon = hostname.indexOf(":");
    return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  useEffect(() => {
    if (!classId || !userId) {
      setLoading(false);
      return;
    }

    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(
          `http://${address}:8080/team/my/${classId}/${userId}`
        );
        if (response.status === 200 && response.data) {
          const teamData = response.data;
          setTeamDetails(teamData);
          setGroupName(teamData.groupName || "");
          setRecruitmentOpen(teamData.recruitmentOpen);
          console.log("Fetched team details:", teamData);

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
      const response = await axios.get(
        `http://${address}:8080/class/${classId}/qualified-teachers`
      );
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
      const response = await axios.get(
        `http://${address}:8080/adviser/${adviserId}/available-schedules/${classId}`
      );
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

  const dropAdviser = async () => {
    if (!dropReason.trim()) {
      alert("Please provide a reason before submitting.");
      return;
    }

    try {
      const res = await axios.post(
        `http://${address}:8080/team/${teamDetails.tid}/leave-adviser`,
        {
          requesterId: userId,
          reason: dropReason,
        }
      );

      alert(res.data.message);
      setShowDropModal(false);
      setDropReason("");
      window.location.reload(); // optional
    } catch (err) {
      console.error("Error submitting leave adviser request:", err);
      alert(err.response?.data?.error || "Failed to submit leave request.");
    }
  };

  const toggleRecruitment = async () => {
    if (!teamDetails?.tid) return;
    setIsUpdating(true);
    try {
      await axios.put(
        `http://${address}:8080/student/${teamDetails.tid}/${
          recruitmentOpen ? "close-recruitment" : "open-recruitment"
        }`,
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
      await axios.put(
        `http://${address}:8080/student/${teamDetails.tid}/update-group-name`,
        {
          groupName,
          requesterId: userId,
        }
      );
    } catch (error) {
      console.error("Error updating group name:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const kickMember = async (memberId) => {
    if (!teamDetails?.tid) return;

    try {
      await axios.delete(
        `http://${address}:8080/student/${teamDetails.tid}/kick-member/${memberId}`,
        {
          data: { requesterId: userId },
        }
      );

      setTeamDetails((prev) => ({
        ...prev,
        memberIds: prev.memberIds.filter((id) => id !== memberId),
        memberNames: prev.memberNames.filter(
          (_, index) => prev.memberIds[index] !== memberId
        ),
      }));

      toast.success("Member removed successfully!");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to remove member. Please try again.");
      console.error("Error removing member:", error);
    }
  };

  const leaveTeam = async () => {
    if (!teamDetails?.tid) return;

    try {
      const response = await axios.delete(
        `http://${address}:8080/team/${teamDetails.tid}/leave`,
        {
          params: { userId },
        }
      );

      alert(response.data.message);

      // Refresh UI after leaving the team
      window.location.reload();
    } catch (error) {
      console.error(
        "Error leaving team:",
        error.response?.data?.error || error.message
      );
      toast.error(error.response?.data?.error || "Failed to leave the team.");
    }
  };

  const deleteTeam = async () => {
    if (!teamDetails?.tid) return;

    try {
      const response = await axios.delete(
        `http://${address}:8080/student/delete-team/${teamDetails.tid}/requester/${userId}`
      );

      alert(response.data.message);
      navigate("/student-dashboard");
    } catch (error) {
      console.error(
        "Error deleting team:",
        error.response?.data?.message || error.message
      );
      toast.error(
        error.response?.data?.message || "Failed to delete the team."
      );
    }
  };

  const transferLeadership = async (newLeaderId) => {
    if (!teamDetails?.tid) return;

    try {
      const response = await axios.put(
        `http://${address}:8080/team/${teamDetails.tid}/transfer-leadership`,
        {
          requesterId: userId,
          newLeaderId: newLeaderId,
        }
      );
      toast.success(
        response.data.message || "Leadership transferred successfully!"
      );
      window.location.reload();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to transfer leadership."
      );
      console.error("Error transferring leadership:", error);
    }
  };

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(
        `http://${address}:8080/get-student/${authState.uid}`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      const { firstname, lastname } = response.data;
      setUserData({ firstname, lastname });

      console.log("Student Info:", response.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
      alert("Error fetching student data. Please try again.");
    }
  };

  useEffect(() => {
    if (authState?.uid) {
      fetchStudentData();
    }
  }, [authState]);

  const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg w-96">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-700 text-xl font-semibold">
              Confirmation
            </h2>
            <button
              className="text-gray-500 hover:text-gray-700 mb-4"
              onClick={onClose}
            >
              ✖
            </button>
          </div>
          <p className="text-gray-600 mt-2">{message}</p>
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-200 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-teal text-white px-4 py-2 rounded-md hover:bg-peach transition"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  console.log("teamDetails:", teamDetails?.tid);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <Navbar userRole={authState.role} />

        <div className="flexbox w-full max-w-6xl mx-auto px-4 py-8 rounded-lg mt-4">
  <button
    onClick={() => navigate(-1)}
    className="bg-gray-700 text-white px-4 py-2 rounded-lg mb-4 hover:bg-gray-500 transition"
  >
    <FiArrowLeft />
  </button>

  <h2 className="text-xl font-semibold text-teal-700 mb-6">
    Team Settings
  </h2>

  {teamDetails ? (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Left Container */}
      <div className="flex-1 flex flex-col space-y-6">
        {/* Change Group Name */}
        <div className="border-b pb-4">
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
              className="bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300 transition"
              disabled={isUpdating}
            >
              Save
            </button>
          </div>
        </div>

        {/* Team Leader */}
        <div>
          <p>
            <strong>Team Leader:</strong>{" "}
            {teamDetails.leaderName || "Unknown Leader"}
          </p>
        </div>

        {/* Team Members */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Team Members</h3>
          {teamDetails.memberNames?.length > 0 ? (
            <div className="rounded-md overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-gray-700 text-white">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Member Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {teamDetails.memberNames.map((member, index) => (
                    <tr
                      key={teamDetails.memberIds[index]}
                      className="hover:bg-gray-100"
                    >
                      <td className="border border-gray-300 px-4 py-3 text-gray-800">
                        {member}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="flex flex-wrap gap-2 justify-center">
                          <button
                            className="group border border-red-300 text-gray-800 px-3 py-2 rounded-md hover:bg-red-600 hover:text-white transition flex items-center gap-2"
                            onClick={() => {
                              setModalMessage(
                                "Are you sure you want to remove this member from the team?"
                              );
                              setConfirmAction(
                                () => () =>
                                  kickMember(teamDetails.memberIds[index])
                              );
                              setIsModalOpen(true);
                            }}
                          >
                            <UserMinus className="h-5 w-5 text-red-600 group-hover:text-white transition" />
                          </button>
                          <button
                            className="group border border-amber-300 text-gray-800 px-3 py-2 rounded-md hover:bg-amber-500 hover:text-white transition flex items-center gap-2"
                            onClick={() => {
                              setModalMessage(
                                "Are you sure you want to transfer leadership?"
                              );
                              setConfirmAction(
                                () => () =>
                                  transferLeadership(
                                    teamDetails.memberIds[index]
                                  )
                              );
                              setIsModalOpen(true);
                            }}
                          >
                            <Crown className="h-5 w-5 text-amber-500 group-hover:text-white transition" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No members in the team.</p>
          )}
        </div>
      </div>

      {/* Right Container */}
      <div className="flex-1 flex flex-col space-y-6">
        {/* Adviser & Schedule */}
        {teamDetails.adviserName !== "No Adviser Assigned" &&
        teamDetails.scheduleDay !== "No Day Set" &&
        teamDetails.scheduleTime !== "No Time Set" ? (
          <div className="p-4 border rounded-md bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">
              Team Adviser & Schedule
            </h3>
            <p className="text-gray-700">
              <strong>Adviser:</strong> {teamDetails.adviserName}
            </p>
            <p className="text-gray-700">
              <strong>Schedule:</strong>{" "}
              {`${teamDetails.scheduleDay}, ${teamDetails.scheduleTime}`}
            </p>
            <button
              onClick={() => setShowDropModal(true)}
              className="mt-4 px-4 py-2 rounded text-white w-full transition bg-red-500 hover:bg-red-600"
            >
              Request to Leave Adviser
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-2 w-full bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Request Adviser & Schedule
          </button>
        )}

        {/* Recruitment Status */}
        <div className="p-4 border rounded-md bg-gray-50">
          <h2 className="text-lg font-semibold text-black">
            Recruitment Status
          </h2>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">
                Open Recruitment
              </p>
              <p className="text-sm text-gray-500">
                Allow new members to join your team
              </p>
            </div>
            <button
              onClick={toggleRecruitment}
              disabled={isUpdating}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                recruitmentOpen ? "bg-green-500" : "bg-gray-300"
              } ${
                isUpdating
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                  recruitmentOpen ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Leave / Delete Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            onClick={() => {
              setModalMessage("Are you sure you want to leave the team?");
              setConfirmAction(() => () => leaveTeam());
              setIsModalOpen(true);
            }}
          >
            Leave Team
          </button>

          {`${userData.firstname} ${userData.lastname}` ===
            teamDetails?.leaderName && (
            <button
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              onClick={() => {
                setModalMessage(
                  "Are you sure you want to delete this team? This action cannot be undone."
                );
                setConfirmAction(() => () => deleteTeam());
                setIsModalOpen(true);
              }}
            >
              Delete Team
            </button>
          )}
        </div>
      </div>
    </div>
  ) : (
    <p className="text-center text-gray-600">You are not in a team.</p>
  )}
</div>

        {showRequestModal && (
          <StudentAdvisoryRequestModal
            teamId={teamDetails.tid}
            requesterId={authState.userId}
            closeModal={() => setShowRequestModal(false)}
          />
        )}

        {showDropModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Drop Adviser</h2>
                <button
                  onClick={() => setShowDropModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              </div>
              <p className="text-gray-700 mb-2">Please provide a reason:</p>
              <textarea
                rows="4"
                value={dropReason}
                onChange={(e) => setDropReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Explain why you want to drop your adviser..."
              />
              <button
                onClick={dropAdviser}
                disabled={!dropReason.trim()}
                className="mt-4 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {isModalOpen && (
          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => {
              if (confirmAction) confirmAction();
              setIsModalOpen(false);
            }}
            message={modalMessage}
          />
        )}
      </div>
    </>
  );
};

export default StudentTeamSettings;
