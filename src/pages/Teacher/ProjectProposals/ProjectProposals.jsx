import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import ProjectProposalService from "../../../services/ProjectProposalService";

const ProjectProposals = () => {
  const { authState } = useContext(AuthContext);
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchProposals = async () => {
    try {
      const token = authState.token;
      const response = await ProjectProposalService.getProposalsByClassWithFeatures(
        authState.classId,
        token
      );
      setProposals(response.data);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
  };

  const updateProposalStatus = async (id, status, reason) => {
    try {
      const token = authState.token;
      const statusData = { status, reason };
      await ProjectProposalService.updateProposalStatus(id, statusData, token);
      fetchProposals(); // Refresh proposals
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating proposal status:", error);
    }
  };

  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchProposals();
    }
  }, [authState]);

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12 font-medium">
        <h1 className="text-2xl font-bold mb-4">Project Proposals</h1>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Project Name</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Reason</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal) => (
              <tr key={proposal.id}>
                <td className="px-4 py-2 border">{proposal.projectName}</td>
                <td className="px-4 py-2 border">{proposal.description}</td>
                <td className="px-4 py-2 border">{proposal.status}</td>
                <td className="px-4 py-2 border">{proposal.reason || "N/A"}</td>
                <td className="px-4 py-2 border">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => {
                      setSelectedProposal(proposal);
                      setEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editModalOpen && selectedProposal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Proposal</h2>
              <label>Status</label>
              <select
                value={selectedProposal.status}
                onChange={(e) =>
                  setSelectedProposal({
                    ...selectedProposal,
                    status: e.target.value,
                  })
                }
              >
                <option value="APPROVED">APPROVED</option>
                <option value="DENIED">DENIED</option>
                <option value="PENDING">PENDING</option>
              </select>
              {selectedProposal.status === "DENIED" && (
                <div>
                  <label>Reason</label>
                  <textarea
                    value={selectedProposal.reason || ""}
                    onChange={(e) =>
                      setSelectedProposal({
                        ...selectedProposal,
                        reason: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              )}
              <button
                onClick={() =>
                  updateProposalStatus(
                    selectedProposal.id,
                    selectedProposal.status,
                    selectedProposal.reason
                  )
                }
              >
                Save
              </button>
              <button onClick={() => setEditModalOpen(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectProposals;
