import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../services/AuthContext";
import Navbar from "../../../components/Navbar/Navbar";
import EditProjectProposalModal from "../../../components/Modals/EditProjectProposalModal";
import axios from "axios";

const ViewProjectProposal = () => {
  const { authState, getDecryptedId, storeEncryptedId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [teamProposals, setTeamProposals] = useState([]);
  const [openProposals, setOpenProposals] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(null);

  const openEditModal = (proposalId) => {
    storeEncryptedId("pid", proposalId);
    setSelectedProposalId(proposalId);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    localStorage.removeItem("pid");
    setIsEditModalOpen(false);
    setSelectedProposalId(null);
  };
  
  const address = window.location.hostname;

  const classId = getDecryptedId("cid");
  const teamId = getDecryptedId("tid");

  useEffect(() => {
    if (authState.uid && teamId) {
      //console.log(`Fetching team proposals for Team ID: ${teamId}`);
      fetchTeamProposals();
    }
  }, [authState.uid, teamId]);

  useEffect(() => {
    if (authState.uid && classId) {
      //console.log(`Fetching open proposals for Class ID: ${classId}`);
      fetchOpenProposals();
    }
  }, [authState.uid, classId]);

  const fetchTeamProposals = async () => {
    try {
      const token = authState.token;
      if (!token) throw new Error("No auth token");

      const response = await axios.get(`http://${address}:8080/proposals/team/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      //console.log("Team Proposals API Response:", response.data);
      setTeamProposals(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error("Error fetching team proposals:", error.response?.data || error.message);
    }
  };

  const fetchOpenProposals = async () => {
    try {
      const token = authState.token;
      if (!token) throw new Error("No auth token");

      const response = await axios.get(`http://${address}:8080/proposals/class/${classId}/open-projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      //console.log("Open Proposals API Response:", response.data);
      setOpenProposals(response.data || []);
    } catch (error) {
      console.error("Error fetching open proposals:", error.response?.data || error.message);
    }
  };
  const handleDeleteProposal = async (proposalId) => {
    try {
      const token = authState.token;
      if (!token) throw new Error("No auth token");
  
      const userId = authState.uid; // Get current user ID
      await axios.delete(`http://${address}:8080/student/delete-proposal/${proposalId}`, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("Proposal deleted successfully");
      fetchTeamProposals(); // Refresh proposals
    } catch (error) {
      console.error("Error deleting proposal:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to delete proposal.");
    }
  };
  const handleSetToOpenProject = async (proposalId) => {
    try {
      const token = authState.token;
      if (!token) throw new Error("No auth token");
  
      const userId = authState.uid; // Get current user ID
      await axios.put(`http://${address}:8080/student/set-to-open-project/${proposalId}`, null, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("Proposal set to Open Project successfully");
      fetchTeamProposals(); // Refresh proposals
    } catch (error) {
      console.error("Error setting proposal to Open Project:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to set proposal to Open Project.");
    }
  };



  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen bg-gray-100">
      <Navbar userRole={authState.role} />

      <div className="p-8 bg-white shadow-md rounded-md w-full">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition mb-6"
        >
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Project Proposals</h1>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">My Team Proposals</h2>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition shadow-md"
            onClick={() => navigate(`/student/project-proposal`)}
          >
            Create Proposal
          </button>
        </div>

        {/* Debugging Logs
        <div className="p-4 bg-gray-200 rounded-md mb-4">
          <h3 className="text-lg font-semibold text-gray-600">Debugging Logs:</h3>
          <pre className="text-xs text-gray-700 overflow-x-auto">
            {JSON.stringify(teamProposals, null, 2)}
          </pre>
        </div> */}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden table-fixed">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="border p-3 text-left font-semibold w-1/6">Project Name</th>
              <th className="border p-3 text-left font-semibold w-1/6">Description</th>
              <th className="border p-3 text-left font-semibold w-1/3">Features</th>
              <th className="border p-3 text-left font-semibold w-1/6">Proposed By</th>
              <th className="border p-3 text-left font-semibold w-1/12">Status</th>
              <th className="border p-3 text-left font-semibold w-1/6">Reason</th>
              <th className="border p-3 text-left font-semibold w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-800">
              {teamProposals.length > 0 ? (
                teamProposals.map((proposal, index) => (
                  <tr key={proposal.pid} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="border p-3">{proposal.projectName}</td>
                    <td className="border p-3">{proposal.description}</td>
                    <td className="border p-3 break-words">
                      {proposal.features?.length > 0 ? (
                        <ul className="list-disc pl-4">
                          {proposal.features.map((f, i) => (
                            <li key={i} className="whitespace-normal">
                              <span className="font-semibold">{f.featureTitle}</span>: {f.featureDescription}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "No features"
                      )}
                    </td>
                    <td className="border p-3">{proposal.proposedByName}</td>
                    <td className="border p-3">{proposal.status}</td>
                    <td className="border p-3">{proposal.reason || "No reason provided"}</td>
                    <td className="border p-3 flex flex-col items-start gap-2">
                      <button
                        className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-full"
                        onClick={() => openEditModal(proposal.pid)}
                      >
                        Edit
                      </button>
                      <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition w-full">
                        Set Official
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition w-full"
                        onClick={() => handleDeleteProposal(proposal.pid)}
                      >
                        Delete
                      </button>
                      <button
                        className="bg-violet-500 text-white px-4 py-2 rounded-md hover:bg-violet-600 transition w-full"
                        onClick={() => handleSetToOpenProject(proposal.pid)}
                      >
                        Give Project
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="border p-3 text-center text-gray-500">No project proposals found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <EditProjectProposalModal 
          proposalId={selectedProposalId} 
          isOpen={isEditModalOpen} 
          onClose={closeEditModal}
          refreshProposals={fetchTeamProposals} 
        />


        {/* Open Project Proposals Header */}
        <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Suggested Project Proposals</h2>

        {/* Open Project Proposals Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-700 text-white">
              <tr>
                {["Project Name", "Description", "Features", "Action"].map((header) => (
                  <th key={header} className="border p-3 text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white text-gray-800">
              {openProposals.length > 0 ? (
                openProposals.map((proposal, index) => (
                  <tr key={proposal.pid} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="border p-3">{proposal.projectName}</td>
                    <td className="border p-3">{proposal.description}</td>
                    <td className="border p-3">
                      {proposal.features?.length > 0 ? (
                        <ul>
                          {proposal.features.map((f, i) => (
                            <li key={i}>{f.featureTitle}</li>
                          ))}
                        </ul>
                      ) : (
                        "No features"
                      )}
                    </td>
                    <td className="border p-3">
                      <button className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition">
                        Take Over
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border p-3 text-center text-gray-500">
                    No open project proposals available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewProjectProposal;