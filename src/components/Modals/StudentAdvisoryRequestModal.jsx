import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../services/AuthContext";
import axios from "axios";
import { FiX, FiChevronDown } from "react-icons/fi";

const StudentAdvisoryRequestModal = ({ teamId, closeModal }) => {
  const { getDecryptedId, uid } = useContext(AuthContext);
  const [advisers, setAdvisers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedAdviser, setSelectedAdviser] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showAdviserDropdown, setShowAdviserDropdown] = useState(false);
  const [showScheduleDropdown, setShowScheduleDropdown] = useState(false);
  const [teamRequests, setTeamRequests] = useState([]);
  const [error, setError] = useState("");
  const address = getIpAddress();

  function getIpAddress() {
    const hostname = window.location.hostname;
    const indexOfColon = hostname.indexOf(":");
    return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  const decryptedTeamId = getDecryptedId("tid");
  const classId = getDecryptedId("cid");

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    const [hour, minute] = timeStr.split(":");
    let h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return `${h}:${minute} ${ampm}`;
  };

  useEffect(() => {
    fetchAdvisers();
    fetchTeamRequests();
  }, []);

  const fetchAdvisers = async () => {
    setShowAdviserDropdown((prev) => !prev);
    setError("");
    if (!classId) return setError("Missing class ID");

    if (advisers.length > 0) return;

    try {
      const res = await axios.get(`http://${address}:8080/class/${classId}/qualified-teachers`);
      setAdvisers(res.data);
    } catch (err) {
      console.error("Error fetching advisers:", err);
      setError("Failed to fetch advisers.");
    }
  };

  const fetchSchedules = async (adviserId) => {
    setError("");
    setShowScheduleDropdown(false);
    setSchedules([]);

    if (!adviserId || !classId) return setError("Invalid adviser/class info");

    try {
      const res = await axios.get(`http://${address}:8080/adviser/${adviserId}/available-schedules/${classId}`);
      setSchedules(res.data.length > 0 ? res.data : []);
      if (res.data.length === 0) setError("No schedules available.");
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError(err.response?.data?.message || "Failed to fetch schedules.");
    }
  };

  const handleRequest = async () => {
    if (!selectedAdviser || !selectedSchedule || !uid || !decryptedTeamId) return;

    try {
      const res = await axios.post(`http://${address}:8080/team/${decryptedTeamId}/request-adviser`, {
        adviserId: selectedAdviser,
        scheduleId: selectedSchedule,
      });

      alert(res.data.message);
      fetchTeamRequests();

      setSelectedAdviser(null);
      setSelectedSchedule(null);

      closeModal();
    } catch (err) {
      console.error("Submission failed:", err);
      alert(err.response?.data?.message || "Failed to submit request. Please try again.");
    }
  };

  const handleDelete = async (requestId) => {
    try {
      await axios.delete(`http://${address}:8080/advisory-requests/${requestId}`);
      fetchTeamRequests();
    } catch (error) {
      console.error("Failed to delete request", error);
      alert("Failed to delete request");
    }
  };

  const fetchTeamRequests = async () => {
    try {
      const res = await axios.get(`http://${address}:8080/team/${decryptedTeamId}/get-all-requests`);
      setTeamRequests(res.data);
    } catch (error) {
      console.error("Failed to load team advisory requests", error);
    }
  };

  const handleLeaveRequest = async () => {
    if (!uid || !decryptedTeamId) {
      return alert("Missing user or team information.");
    }
  
    const reason = prompt("Please provide a reason for leaving your adviser:");
  
    if (!reason || reason.trim() === "") {
      return alert("Leave request cancelled or reason was empty.");
    }
  
    try {
      const res = await axios.post(`http://${address}:8080/team/${decryptedTeamId}/leave-adviser`, {
        requesterId: uid,
        reason: reason.trim()
      });
  
      alert(res.data.message);
      fetchTeamRequests(); // Refresh list after submission
    } catch (err) {
      console.error("Leave request error:", err);
      alert(err.response?.data?.error || "Failed to submit leave request.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg px-6 py-10 w-full max-w-3xl relative shadow-lg max-h-[90vh] overflow-y-auto">
        <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600">
          <FiX size={24} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Request Adviser & Schedule</h2>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        {/* Adviser dropdown */}
        <div className="mb-4 relative">
          <label className="block font-medium mb-1">Select Adviser</label>
          <button
            onClick={fetchAdvisers}
            className="bg-white border border-gray-300 px-3 py-2 rounded-md w-full text-left flex justify-between items-center"
          >
            {selectedAdviser
              ? advisers.find((a) => a.uid === selectedAdviser)?.firstname + " " +
                advisers.find((a) => a.uid === selectedAdviser)?.lastname
              : "Select an Adviser"}
            <FiChevronDown />
          </button>
          {showAdviserDropdown && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full shadow-lg max-h-48 overflow-auto">
              {advisers.map((adv) => (
                <li
                  key={adv.uid}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    setSelectedAdviser(adv.uid);
                    fetchSchedules(adv.uid);
                    setShowAdviserDropdown(false);
                  }}
                >
                  {adv.firstname} {adv.lastname} - {adv.interests}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Schedule dropdown */}
        <div className="mb-4 relative">
          <label className="block font-medium mb-1">Select Schedule</label>
          <button
            onClick={() => setShowScheduleDropdown((prev) => !prev)}
            className="bg-white border border-gray-300 px-3 py-2 rounded-md w-full text-left flex justify-between items-center"
          >
            {selectedSchedule
              ? `${schedules.find((s) => s.schedid === selectedSchedule)?.day} - ` +
                `${formatTime(schedules.find((s) => s.schedid === selectedSchedule)?.startTime)} - ` +
                `${formatTime(schedules.find((s) => s.schedid === selectedSchedule)?.endTime)}`
              : schedules.length > 0
              ? "Select a Schedule"
              : "No Available Schedules"}
            <FiChevronDown />
          </button>
          {showScheduleDropdown && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full shadow-lg max-h-48 overflow-auto">
              {schedules.map((sched) => (
                <li
                  key={sched.schedid}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
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

        {/* Submit */}
        <button
          onClick={handleRequest}
          disabled={!selectedAdviser || !selectedSchedule}
          className="bg-[#323c47] text-white px-6 py-3 rounded-md hover:bg-gray-900 transition w-full mt-4"
        >
          Submit Request
        </button>

        {teamRequests.length > 0 && (
          <div className="mt-8">
            <h3 className="text-md font-semibold mb-2">Team Advisory Requests</h3>
            <table className="w-full text-left border border-gray-300 rounded-md overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Adviser</th>
                  <th className="px-4 py-2">Schedule</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Reason</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {teamRequests.map((req) => (
                  <tr key={req.requestId} className="border-t">
                    <td className="px-4 py-2">{req.adviserName}</td>
                    <td className="px-4 py-2">
                      {req.scheduleDay} - {formatTime(req.scheduleTime?.split(" - ")[0])} - {formatTime(req.scheduleTime?.split(" - ")[1])}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-white text-sm
                        ${req.status === 'PENDING' ? 'bg-yellow-500' :
                          req.status === 'ACCEPTED' ? 'bg-green-600' :
                          req.status === 'REQUEST_TO_LEAVE' ? 'bg-orange-500' :
                          req.status === 'DROP' ? 'bg-gray-600' :
                          'bg-red-500'}`}>
                        {req.status === 'REQUEST_TO_LEAVE'
                          ? 'Leaving'
                          : req.status === 'DROP'
                          ? 'Dropped'
                          : req.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-700">{req.reason || "No Reason Provided"}</td>
                    <td className="px-4 py-2">
                    {["ACCEPTED","PENDING", "REJECTED", "REQUEST_TO_LEAVE", "DROP"].includes(req.status) && (
                        <button
                        onClick={() => handleDelete(req.requestId)}
                        className="bg-[#323c47] text-white px-3 py-1 rounded hover:bg-gray-900 transition"
                        >
                        Remove Request
                        </button>
                    )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAdvisoryRequestModal;