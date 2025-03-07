import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import axios from "axios";

const ProjectProposals = () => {
  const { authState, getDecryptedId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [advisers, setAdvisers] = useState({});
  const [loading, setLoading] = useState(true);
  const [classId, setClassId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedProposalId, setSelectedProposalId] = useState(null);

  const address = getIpAddress();

  function getIpAddress() {
      const hostname = window.location.hostname;
      const indexOfColon = hostname.indexOf(':');
      return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate("/login");
      return;
    }

    const cid = getDecryptedId("cid");
    if (!cid) {
      console.error("Class ID is not available. Please navigate to a class page first.");
      setLoading(false);
      return;
    }
    setClassId(cid);

    const fetchProposals = async () => {
      try {
        const { data } = await axios.get(
          `http://${address}:8080/proposals/class/with-features/${cid}`,
          { headers: { Authorization: `Bearer ${authState.token}` } }
        );
        setProposals(data || []);
        fetchAdvisers(data);
      } catch (error) {
        console.error("Error fetching project proposals:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAdvisers = async (proposals) => {
      try {
        const adviserMap = {};
        await Promise.all(
          proposals.map(async (proposal) => {
            if (proposal.adviserId) {
              const { data } = await axios.get(
                `http://${address}:8080/proposals/${proposal.pid}/adviser`,
                { headers: { Authorization: `Bearer ${authState.token}` } }
              );
              adviserMap[proposal.pid] = data.adviserFullName || "N/A";
            }
          })
        );
        setAdvisers(adviserMap);
      } catch (error) {
        console.error("Error fetching adviser names:", error);
      }
    };

    fetchProposals();
  }, [authState, navigate, getDecryptedId]);

  const handleApprove = async (proposalId) => {
    try {
      await axios.put(
        `http://${address}:8080/teacher/status-proposal/${proposalId}`,
        { status: "APPROVED", reason: null },
        { headers: { Authorization: `Bearer ${authState.token}` } }
      );
      alert("Proposal approved successfully.");
      setProposals((prev) =>
        prev.map((proposal) =>
          proposal.pid === proposalId ? { ...proposal, status: "APPROVED", reason: null } : proposal
        )
      );
    } catch (error) {
      console.error("Error approving proposal:", error);
    }
  };

  const handleReject = async () => {
    try {
      await axios.put(
        `http://${address}:8080/teacher/status-proposal/${selectedProposalId}`,
        { status: "DENIED", reason: rejectReason },
        { headers: { Authorization: `Bearer ${authState.token}` } }
      );
      alert("Proposal rejected successfully.");
      setProposals((prev) =>
        prev.map((proposal) =>
          proposal.pid === selectedProposalId ? { ...proposal, status: "DENIED", reason: rejectReason } : proposal
        )
      );
      setShowModal(false);
      setRejectReason("");
    } catch (error) {
      console.error("Error rejecting proposal:", error);
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
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12 font-medium">
        
      <div className="flex justify-start mb-4">
          <button
            className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-peach hover:text-white"
            onClick={() => navigate(-1)} // Go back to the previous page
          >
            Back
          </button>
        </div>
        <h1 className="text-lg font-semibold mb-6 text-center text-teal">Project Proposals</h1>
  
        {/* Proposals Table */}
        <div className="overflow-y-auto max-h-96 rounded-lg shadow-md">
          {proposals.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table Header */}
              <thead className="sticky top-0 bg-teal text-white z-20 shadow-lg">
                <tr className="bg-teal-500 text-white">
                  <th className="px-6 py-3 text-center text-sm font-bold text-white">Project Name</th>
                  <th className="px-6 py-3 text-center text-sm font-bold text-white">Description</th>
                  <th className="px-6 py-3 text-center text-sm font-bold text-white">Features</th>
                  <th className="px-6 py-3 text-center text-sm font-bold text-white">Adviser</th>
                  <th className="px-6 py-3 text-center text-sm font-bold text-white">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-bold text-white">Reason</th>
                  <th className="px-6 py-3 text-center text-sm font-bold text-white">Action</th>
                </tr>
              </thead>
  
              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {proposals.map((proposal) => (
                  <tr key={proposal.pid}>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{proposal.projectName}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{proposal.description}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {proposal.features.map((feature, index) => (
                        <div key={index}>
                          <strong>{feature.featureTitle}:</strong> {feature.featureDescription}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{advisers[proposal.pid] || "N/A"}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{proposal.status}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{proposal.reason || "N/A"}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleApprove(proposal.pid)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProposalId(proposal.pid);
                            setShowModal(true);
                          }}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">No project proposals available.</p>
          )}
        </div>
      </div>
  
      {/* Reject Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-center">Reason for Rejection</h2>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter reason for rejection"
            ></textarea>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="mr-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default ProjectProposals;
