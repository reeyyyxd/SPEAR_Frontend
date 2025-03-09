import React, { useEffect, useState, useContext } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import RejectModal from "../../../components/Modals/RejectModal";
import axios from "axios";

const TeamApplications = () => {
  const { authState, storeEncryptedId, getDecryptedId } = useContext(AuthContext); 
  const [pendingApplications, setPendingApplications] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, recruitmentId: null });
  const [rejectReason, setRejectReason] = useState("");

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
  const confirmAccept = window.confirm("Are you sure you want to accept this application?");

  if (!confirmAccept) return;  

  try {
    await axios.post(`http://${address}:8080/student/review/${recruitmentId}`, {
      isAccepted: true,
    });
    fetchApplications();  
  } catch (error) {
    console.error("Error accepting application:", error);
  }
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

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="main-content bg-white text-gray-900 md:px-20 lg:px-28 pt-8 md:pt-12">
        
        {/* Pending Applications Table */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Team Applications</h1>
        <h2 className="text-xl font-semibold text-teal-600 mb-2">Pending Applications for My Team</h2>
        <div className="overflow-x-auto mb-8">
          <table className="w-full border border-gray-400 rounded-lg shadow-md">
            <thead>
              <tr className="bg-teal-600 text-black">
                <th className="border border-gray-400 px-6 py-3 text-left text-black">Student Name</th>
                <th className="border border-gray-400 px-6 py-3 text-left text-black">Team Name</th>
                <th className="border border-gray-400 px-6 py-3 text-left text-black">Class</th>
                <th className="border border-gray-400 px-6 py-3 text-left text-black">Role & Reason</th>
                <th className="border border-gray-400 px-6 py-3 text-left text-black">Actions</th>
              </tr>
            </thead>
              <tbody>
            {pendingApplications.length > 0 ? (
              pendingApplications.map((app) => (
                <tr key={app.trid} className="hover:bg-gray-100">
                  <td className="border border-gray-400 px-6 py-3 text-gray-900">{app.studentName || "Unknown"}</td>
                  <td className="border border-gray-400 px-6 py-3 text-gray-900">{app.groupName || "No Team Name"}</td>
                  <td className="border border-gray-400 px-6 py-3 text-gray-900">{app.classDescription || "No Class Info"}</td>
                  
                  {/* Role & Reason - Displayed correctly in a single block */}
                  <td className="border border-gray-400 px-6 py-3 text-gray-900">
                    <p className="font-semibold">{app.role}</p> 
                    <p className="text-gray-700">{app.reason}</p>
                  </td>

                  {/* Action Buttons - Ensuring proper spacing */}
                  <td className="border border-gray-400 px-6 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        onClick={() => handleAccept(app.trid)}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        onClick={() => setRejectModal({ isOpen: true, recruitmentId: app.trid })}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center border border-gray-400 px-6 py-3 text-gray-900">
                  No pending applications.
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>

        {/* My Applications Table */}
        <h2 className="text-xl font-semibold text-teal-600 mb-2">My Applications</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400 rounded-lg shadow-md">
            <thead>
              <tr className="bg-teal-600 text-black">
                <th className="border border-gray-400 px-6 py-3 text-left text-black">Class Name</th>
                <th className="border border-gray-400 px-6 py-3 text-left text-black">Team Name</th>
                <th className="border border-gray-400 px-6 py-3 text-left text-black">Leader</th>
                <th className="border border-gray-400 px-6 py-3 text-left text-black">Role and Reason</th>
                <th className="border border-gray-400 px-6 py-3 text-left text-black">Status</th>
              </tr>
            </thead>
            <tbody>
              {myApplications.length > 0 ? (
                myApplications.map((app) => (
                  <tr key={app.trid} className="hover:bg-gray-100">
                    <td className="border border-gray-400 px-6 py-3 text-gray-900">{app.classDescription}</td>
                    <td className="border border-gray-400 px-6 py-3 text-gray-900">{app.groupName}</td>
                    <td className="border border-gray-400 px-6 py-3 text-gray-900">{app.leaderName}</td>
                    <td className="border border-gray-400 px-6 py-3 text-gray-900">
                      <strong>{app.role}</strong> <br />
                      {app.reason}
                    </td>
                    <td className="border border-gray-400 px-6 py-3 text-gray-900 font-bold">{app.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center border border-gray-400 px-6 py-3 text-gray-900">
                    No applications submitted.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
  );
};

export default TeamApplications;