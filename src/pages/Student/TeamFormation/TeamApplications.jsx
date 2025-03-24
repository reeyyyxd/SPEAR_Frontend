import React, { useEffect, useState, useContext } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import RejectModal from "../../../components/Modals/RejectModal";
import axios from "axios";
import { Check, X } from "lucide-react"

const TeamApplications = () => {
  const { authState, storeEncryptedId, getDecryptedId } = useContext(AuthContext); 
  const [pendingApplications, setPendingApplications] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, recruitmentId: null });
  const [rejectReason, setRejectReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);


  const address = getIpAddress();

  function getIpAddress() {
    const hostname = window.location.hostname;
    const indexOfColon = hostname.indexOf(":");
    return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);

    try {
        const leaderTeamsResponse = await axios.get(`http://${address}:8080/user/${authState.uid}/leader-teams`);
        
        if (leaderTeamsResponse.status === 200 && leaderTeamsResponse.data.length > 0) {
            const teamIds = leaderTeamsResponse.data.map(team => team.tid);

            storeEncryptedId("tid", JSON.stringify(teamIds)); 
            const decryptedTeamIds = JSON.parse(getDecryptedId("tid"));

            const pendingApplicationsData = await Promise.all(
                decryptedTeamIds.map(async (tid) => {
                    const response = await axios.get(`http://${address}:8080/team/${tid}/pending-applications`);
                    return response.data;
                })
            );

            setPendingApplications(pendingApplicationsData.flat());
        }

        const myApplicationsResponse = await axios.get(`http://${address}:8080/student/${authState.uid}/my-applications`);
        if (myApplicationsResponse.status === 200) {
            setMyApplications(myApplicationsResponse.data);
        }

    } catch (error) {
        console.error("Error fetching applications:", error);
    } finally {
        setLoading(false);
    }
};

const handleAccept = async (recruitmentId) => {
  try {
    await axios.post(`http://${address}:8080/student/review/${recruitmentId}`, {
      isAccepted: true,
    });
    fetchApplications();  
  } catch (error) {
    console.error("Error accepting application:", error);
  }
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-700 text-xl font-semibold mb-4">Confirm Acceptance</h2>
        <button
         className="text-gray-500 hover:text-gray-700 mb-4"
          onClick={onClose}
          >
          ✖
          </button>
        </div>
        <p className="text-gray-600">Are you sure you want to accept this application?</p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-teal text-white px-4 py-2 rounded hover:bg-peach"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

  const handleReject = async () => {
    try {
      await axios.post(`http://${address}:8080/student/review/${rejectModal.recruitmentId}`, {
        isAccepted: false,
        leaderReason: rejectReason,
      });
      setRejectModal({ isOpen: false, recruitmentId: null });
      setRejectReason("");
      fetchApplications();
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-teal">Loading...</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500 text-white">Pending</span>;
      case "ACCEPTED":
        return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-500 text-white">Accepted</span>;
      case "REJECTED":
        return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-500 text-white">Rejected</span>;
      case "EXPIRED":
        return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-500 text-white">Expired</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-300 text-black">{status}</span>;
    }
  };
  

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen bg-gray-100">
      <Navbar userRole={authState.role} />
      <div className="main-content bg-white text-gray-900 md:px-20 lg:px-28 pt-8 md:pt-12">

      <div className="overflow-x-auto">
        {/* Pending Applications Table */}
        <h1 className="text-3xl font-bold text-gray-700 mb-4">Team Applications</h1>
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Pending Applications for My Team</h2>
        <div className="overflow-x-auto mb-8">
          <table className="w-full border shadow-md rounded-lg overflow-hidden table-fixed">
            <thead className="bg-gray-700 text-white text-center">
              <tr>
                <th className="border border-gray-300 px-6 py-3">Student Name</th>
                <th className="border border-gray-300 px-6 py-3">Team Name</th>
                <th className="border border-gray-300 px-6 py-3">Class</th>
                <th className="border border-gray-300 px-6 py-3">Role & Reason</th>
                <th className="border border-gray-300 px-6 py-3">Actions</th>
              </tr>
            </thead>
              <tbody className="bg-gray-100 text-center">
            {pendingApplications.length > 0 ? (
              pendingApplications.map((app) => (
                <tr key={app.trid} className="hover:bg-gray-200">
                  <td className="border border-gray-300 px-6 py-3 text-gray-900">{app.studentName || "Unknown"}</td>
                  <td className="border border-gray-300 px-6 py-3 text-gray-900">{app.groupName || "No Team Name"}</td>
                  <td className="border border-gray-300 px-6 py-3 text-gray-900">{app.classDescription || "No Class Info"}</td>
                  
                  {/* Role & Reason - Displayed correctly in a single block */}
                  <td className="border border-gray-300 px-6 py-3 text-gray-900">
                    <p className="font-semibold">{app.role}</p> 
                    <p className="text-gray-700">{app.reason}</p>
                  </td>

                  {/* Action Buttons - Ensuring proper spacing */}
                  <td className="border border-gray-300 px-6 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    {/* Accept Button */}
                    <button
                      className="bg-white border border-green-500 px-4 py-2 rounded-lg hover:bg-green-100 transition-all flex items-center space-x-2 group"
                      onClick={() => {
                        setSelectedAppId(app.trid);
                        setIsModalOpen(true);
                      }}
                    >
                      <Check className="h-4 w-4 text-green-500 group-hover:text-gray-800 transition-colors" />
                     <span className="text-green-500 group-hover:text-gray-800 transition-colors">Accept</span>
                    </button>

                    {/* Reject Button */}
                    <button
                      className="bg-white border border-red-500 px-4 py-2 rounded-lg hover:bg-red-100 transition-all flex items-center space-x-2 group"
                      onClick={() => setRejectModal({ isOpen: true, recruitmentId: app.trid })}
                    >
                      <X className="h-4 w-4 text-red-500 group-hover:text-gray-800 transition-colors" />
                      <span className="text-red-500 group-hover:text-gray-800 transition-colors">Reject</span>
                    </button>
                  </div>
                </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center bg-gray-100 px-6 py-3 text-gray-900">
                  No pending applications.
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>

        {/* My Applications Table */}
        <h2 className="text-xl font-semibold text-gray-600 mb-2">My Applications</h2>
          <div className="overflow-x-auto">
          <table className="w-full border shadow-md rounded-lg overflow-hidden table-fixed border-collapse">
            <thead className="bg-gray-700 text-center">
              <tr className="bg-teal-600 text-white">
                <th className="border border-gray-300 px-6 py-3">Class Name</th>
                <th className="border border-gray-300 px-6 py-3">Team Name</th>
                <th className="border border-gray-300 px-6 py-3">Leader</th>
                <th className="border border-gray-300 px-6 py-3">Role and Reason</th>
                <th className="border border-gray-300 px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-center bg-gray-100">
              {myApplications.length > 0 ? (
                myApplications.map((app) => (
                  <tr key={app.trid} className="hover:bg-gray-200">
                    <td className="border border-gray-300 px-6 py-3 text-gray-900">{app.classDescription}</td>
                    <td className="border border-gray-300 px-6 py-3 text-gray-900">{app.groupName}</td>
                    <td className="border border-gray-300 px-6 py-3 text-gray-900">{app.leaderName}</td>
                    <td className="border border-gray-300 px-6 py-3 text-gray-900">
                      <strong>{app.role}</strong> <br />
                      {app.reason}
                    </td>
                    <td className="border border-gray-300 px-6 py-3 text-gray-900 font-bold">
                      {getStatusBadge(app.status)}
                      </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center px-6 py-3 text-gray-900">
                    No applications submitted.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {
            handleAccept(selectedAppId);
            setIsModalOpen(false);
          }}
        />
      )}

        {/* Reject Modal */}
        {rejectModal.isOpen && (
        <RejectModal 
          onClose={() => setRejectModal({ isOpen: false, recruitmentId: null })} 
          onSubmit={handleReject} 
          rejectReason={rejectReason}
          setRejectReason={setRejectReason}
        />
      )}
      </div>
    </div>
    </div>
  );
};

export default TeamApplications;