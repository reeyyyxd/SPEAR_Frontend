import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import { FiX } from "react-icons/fi";
import { FiArrowLeft } from "react-icons/fi";

const TeacherAdvisoryRequest = () => {
  const { authState } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [declineModal, setDeclineModal] = useState(null); // holds requestId
  const [declineReason, setDeclineReason] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const address = window.location.hostname;

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const statusParam =
        statusFilter === "ALL" ? "all-requests" : `requests/${statusFilter}`;
      const res = await axios.get(
        `http://${address}:8080/adviser/${authState.uid}/${statusParam}`,
        {
          headers: { Authorization: `Bearer ${authState.token}` },
        }
      );
      setRequests(res.data || []);
    } catch (error) {
      console.error("Failed to fetch advisory requests", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await axios.post(
        `http://${address}:8080/advisory-requests/${requestId}/accept`
      );
      alert("Request accepted");
      fetchRequests();
    } catch (err) {
      console.error("Accept error:", err);
      alert("Failed to accept request.");
    }
  };

  const handleDecline = async () => {
    try {
      await axios.post(
        `http://${address}:8080/advisory-requests/${declineModal}/decline`,
        { reason: declineReason }
      );
      alert("Request declined.");
      setDeclineModal(null);
      setDeclineReason("");
      fetchRequests();
    } catch (err) {
      console.error("Decline error:", err);
      alert("Failed to decline request.");
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    const [hour, minute] = timeStr.split(":");
    let h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return `${h}:${minute} ${ampm}`;
  };

  const filteredRequests =
    statusFilter === "ALL"
      ? requests
      : requests.filter((r) => r.status === statusFilter);

  const handleApproveLeave = async (requestId) => {
    try {
      await axios.post(
        `http://${address}:8080/advisory-requests/${requestId}/handle-leave`,
        {
          approve: true,
        }
      );
      alert("Adviser dropped. Team is now unassigned.");
      fetchRequests();
    } catch (err) {
      console.error("Error dropping team:", err);
      alert("Failed to drop adviser and schedule.");
    }
  };

  const handleDeclineLeave = async (requestId) => {
    try {
      await axios.post(
        `http://${address}:8080/advisory-requests/${requestId}/handle-leave`,
        {
          approve: false,
          reason: "Leave request denied. Adviser remains assigned.",
        }
      );
      alert("Leave request rejected. Adviser remains.");
      fetchRequests();
    } catch (err) {
      console.error("Error declining leave:", err);
      alert("Failed to decline leave request.");
    }
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;

    try {
      await axios.delete(
        `http://${address}:8080/advisory-requests/${requestId}`
      );
      alert("Request deleted successfully.");
      fetchRequests();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete request.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState?.role} />

      <div className="main-content bg-white p-4 sm:p-6 md:p-8 w-full">
        <button
          onClick={() => window.history.back()}
          className="mb-4 bg-[#323c47] text-white px-4 py-2 rounded hover:opacity-90"
        >
          Back
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Team Advisory Requests
        </h1>

        <div className="flex justify-center gap-4 mb-4">
          {["ALL", "PENDING", "ACCEPTED", "REJECTED"].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded border ${
                statusFilter === status
                  ? "bg-[#323c47] text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-400">No requests found.</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-[#323c47] text-white">
                <tr>
                  <th className="px-4 py-2 text-left text-sm">
                    Class Description
                  </th>
                  <th className="px-4 py-2 text-left text-sm">Group Name</th>
                  <th className="px-4 py-2 text-left text-sm">Leader</th>
                  <th className="px-4 py-2 text-left text-sm">Members</th>
                  <th className="px-4 py-2 text-left text-sm">Schedule</th>
                  <th className="px-4 py-2 text-left text-sm">Status</th>
                  <th className="px-4 py-2 text-left text-sm">Reason</th>
                  <th className="px-4 py-2 text-left text-sm"></th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.requestId} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">
                      {req.classDescription}
                    </td>
                    <td className="px-4 py-2 text-sm">{req.groupName}</td>
                    <td className="px-4 py-2 text-sm">{req.leaderName}</td>
                    <td className="px-4 py-2 text-sm">
                      <ul className="list-disc ml-4">
                        {req.memberNames.map((name, i) => (
                          <li key={i} className="text-sm">
                            {name}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {req.scheduleDay} -{" "}
                      {formatTime(req.scheduleTime?.split(" - ")[0])} -{" "}
                      {formatTime(req.scheduleTime?.split(" - ")[1])}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-semibold inline-block ${
                          req.status === "PENDING"
                            ? "bg-yellow-500 text-white"
                            : req.status === "ACCEPTED"
                            ? "bg-green-600 text-white"
                            : req.status === "REJECTED"
                            ? "bg-red-500 text-white"
                            : req.status === "REQUEST_TO_LEAVE"
                            ? "bg-orange-500 text-white"
                            : "bg-gray-400 text-white"
                        }`}
                      >
                        {req.status === "REQUEST_TO_LEAVE"
                          ? "Request to Leave"
                          : req.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">{req.reason || "—"}</td>
                    <td className="px-4 py-2 space-x-2">
                      {req.status === "PENDING" && (
                        <>
                          <button
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-800"
                            onClick={() => handleAccept(req.requestId)}
                          >
                            Accept
                          </button>
                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
                            onClick={() => setDeclineModal(req.requestId)}
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {req.status === "REQUEST_TO_LEAVE" && (
                        <>
                          <button
                            className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-800"
                            onClick={() => handleApproveLeave(req.requestId)}
                          >
                            Drop Team
                          </button>
                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-blue-800"
                            onClick={() => handleDeclineLeave(req.requestId)}
                          >
                            Decline Leave
                          </button>
                        </>
                      )}

                      {["REJECTED", "DROP"].includes(req.status) && (
                        <button
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700"
                          onClick={() => handleDelete(req.requestId)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Decline Reason Modal */}
        {declineModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md relative">
              <button
                onClick={() => setDeclineModal(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                <FiX size={20} />
              </button>
              <h2 className="text-lg font-semibold mb-4">Reason for Decline</h2>
              <textarea
                rows="4"
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                placeholder="Enter your reason here..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
              />
              <button
                onClick={handleDecline}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
              >
                Submit Decline
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAdvisoryRequest;
