import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";

const ProjectProposals = () => {
  const { authState, getDecryptedId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [advisers, setAdvisers] = useState({});
  const [loading, setLoading] = useState(true);
  const [classId, setClassId] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [rejectReason, setRejectReason] = useState(""); // Reason for rejection
  const [selectedProposalId, setSelectedProposalId] = useState(null); // Proposal ID for rejection
  
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
        const response = await fetch(`http://localhost:8080/proposals/class/with-features/${cid}`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.error("Unauthorized. Please log in again.");
            navigate("/login");
            return;
          }
          throw new Error(`Failed to fetch project proposals. Status: ${response.status}`);
        }

        const data = await response.json();
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
        for (const proposal of proposals) {
          if (proposal.adviserId) {
            const response = await fetch(`http://localhost:8080/proposals/${proposal.pid}/adviser`, {
              headers: {
                Authorization: `Bearer ${authState.token}`,
              },
            });
            const data = await response.json();
            adviserMap[proposal.pid] = data.adviserFullName || "N/A";
          }
        }
        setAdvisers(adviserMap);
      } catch (error) {
        console.error("Error fetching adviser names:", error);
      }
    };

    fetchProposals();
  }, [authState, navigate, getDecryptedId]);

  // Approve Proposal
  const handleApprove = async (proposalId) => {
    try {
      const response = await fetch(`http://localhost:8080/teacher/status-proposal/${proposalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ status: "APPROVED", reason: null }),
      });

      if (response.ok) {
        alert("Proposal approved successfully.");
        setProposals((prevProposals) =>
          prevProposals.map((proposal) =>
            proposal.pid === proposalId ? { ...proposal, status: "APPROVED", reason: null } : proposal
          )
        );
      } else {
        const errorData = await response.json();
        alert(`Failed to approve proposal: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error approving proposal:", error);
    }
  };

  // Reject Proposal
  const handleReject = async () => {
    try {
      const response = await fetch(`http://localhost:8080/teacher/status-proposal/${selectedProposalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ status: "DENIED", reason: rejectReason }),
      });

      if (response.ok) {
        alert("Proposal rejected successfully.");
        setProposals((prevProposals) =>
          prevProposals.map((proposal) =>
            proposal.pid === selectedProposalId ? { ...proposal, status: "DENIED", reason: rejectReason } : proposal
          )
        );
        setShowModal(false); // Close the modal
        setRejectReason(""); // Clear the reason
      } else {
        const errorData = await response.json();
        alert(`Failed to reject proposal: ${errorData.error}`);
      }
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
