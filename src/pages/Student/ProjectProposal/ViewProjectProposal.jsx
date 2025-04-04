import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../services/AuthContext";
import Navbar from "../../../components/Navbar/Navbar";
import EditProjectProposalModal from "../../../components/Modals/EditProjectProposalModal";
import axios from "axios";
import { Pencil, BadgeX , BadgeCheck , Trash2 , PackageOpen , Crown , Plus } from "lucide-react"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewProjectProposal = () => {
  const { authState, getDecryptedId, storeEncryptedId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [teamProposals, setTeamProposals] = useState([]);
  const [openProposals, setOpenProposals] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [officialProjectId, setOfficialProjectId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [activeTab, setActiveTab] = useState("team");


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

  const getStatusBadge = (status) => {
    const baseClass = "px-3 py-1 rounded-full text-white text-sm font-semibold"; 
  
    switch (status) {
      case "APPROVED":
        return <span className={`${baseClass} bg-green-500`}>Approved</span>;
      case "DENIED":
        return <span className={`${baseClass} bg-red-500`}>Denied</span>;
      case "PENDING":
        return <span className={`${baseClass} bg-yellow-500`}>Pending</span>;
      case "OPEN":
        return <span className={`${baseClass} bg-purple-500`}>Open</span>;
      default:
        return <span className={`${baseClass} bg-gray-500`}>{status}</span>;
    }
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
  
      setOpenProposals(response.data || []);
    } catch (error) {
      console.error("Error fetching open proposals:", error.response?.data || error.message);
    }
  };


  const handleDeleteProposal = async (proposalId) => {
  
    try {
      const token = authState.token;
      if (!token) throw new Error("No auth token");
  
      const userId = authState.uid;
      await axios.delete(`http://${address}:8080/student/delete-proposal/${proposalId}`, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });
  
      toast.success("Proposal deleted successfully");
      fetchTeamProposals();
    } catch (error) {
      console.error("Error deleting proposal:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to delete proposal.");
    }
  };
  
  const handleSetToOpenProject = async (proposalId) => {

    try {
      const token = authState.token;
      if (!token) throw new Error("No auth token");
  
      const userId = authState.uid;
      await axios.put(`http://${address}:8080/student/set-to-open-project/${proposalId}`, null, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // alert("Proposal set to Open Project successfully");
      toast.success("Proposal set to Open Project successfully");
      fetchTeamProposals();
      window.location.reload();
    } catch (error) {
      console.error("Error setting proposal to Open Project:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to set proposal to Open Project.");
    }
  };
  
  const handleTakeOwnership = async (proposalId) => {

    try {
      const token = authState.token;
      if (!token) throw new Error("No auth token");
  
      const userId = authState.uid;
      await axios.put(`http://${address}:8080/student/take-ownership/${proposalId}?userId=${userId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      toast.success("You have successfully claimed and accepted this project.");
      fetchOpenProposals();
      window.location.reload();
    } catch (error) {
      console.error("Error taking ownership of project:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to claim project.");
    }
  };

  const fetchOfficialProject = async () => {
    try {
      const token = authState.token;
      if (!token) throw new Error("No auth token");
  
      const response = await axios.get(`http://${address}:8080/teams/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data && response.data.projectId) {
        setOfficialProjectId(response.data.projectId);
      } else {
        setOfficialProjectId(null); // No official project assigned
      }
    } catch (error) {
      console.error("Error fetching official project:", error.response?.data || error.message);
      setOfficialProjectId(null);  
    }
  };
  
  useEffect(() => {
    if (authState.uid && teamId) {
      fetchOfficialProject();
    }
  }, [authState.uid, teamId]);

  const handleSetOfficialProject = async (proposalId) => {

    try {
      const token = authState.token;
      if (!token) throw new Error("No auth token");
  
      await axios.put(`http://${address}:8080/team/set-official/${teamId}`, null, {
        params: { proposalId, leaderId: authState.uid },
        headers: { Authorization: `Bearer ${token}` },
      });
  
      toast.success("Project successfully set as the official project!");
      fetchOfficialProject(); // Refresh after setting
    } catch (error) {
      console.error("Error setting official project:", error.response?.data || error.message);
      
      toast.error(error.response?.data?.error || "Failed to set official project.");
    }
  };
  
  
  const handleUnsetOfficialProject = async () => {
    
    try {
      const token = authState.token;
      if (!token) throw new Error("No auth token");
  
      await axios.put(`http://${address}:8080/team/unset-official/${teamId}`, null, {
        params: { leaderId: authState.uid },
        headers: { Authorization: `Bearer ${token}` },
      });
  
      toast.success("Official project removed successfully");
      fetchOfficialProject(); // Refresh after unsetting
    } catch (error) {
      console.error("Error unsetting official project:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to remove official project.");
    }
  };

  const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg w-96">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-700 text-xl font-semibold">Confirmation</h2>
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
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
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
  

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <div className="grid grid-cols-1 md:grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />

      <div className="flex flex-col p-8 bg-white shadow-md rounded-md min-h-screen">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg mb-4 hover:bg-gray-500 transition"
        >
          Back
        </button>
        <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-5">Project Proposals</h1>
        <button
            className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-500 transition flex items-center space-x-2"
            onClick={() => navigate(`/student/project-proposal`)}
          >
            <Plus className="h-4 w-4"  />
            <span>
           Create Proposal</span>
          </button>
        </div>
       
          <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
      <button
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${
            activeTab === "team"
              ? "bg-white shadow text-black font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("team")}
        >
          Team Proposals
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded-md transition ml-1 ${
            activeTab === "suggested"
              ? "bg-white shadow text-black font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("suggested")}
        >
          Suggested Proposals
        </button>
      </div>

        {activeTab === "team" ? (
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <h2 className="text-xl font-semibold text-gray-700 mt-6">My Team Proposals</h2>
          <p className="text-sm text-gray-500 mb-4">Review and manage project proposals from your team.</p>
          <div className="min-w-[800px]">
          <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden table-fixed">
          <thead className="bg-gray-700 text-white text-center">
            <tr>
              <th className="border p-3 text-center font-semibold w-1/6">Project Name</th>
              <th className="border p-3 text-center font-semibold w-1/6">Description</th>
              <th className="border p-3 text-center font-semibold w-1/3">Objectives</th>
              <th className="border p-3 text-center font-semibold w-1/6">Proposed By</th>
              <th className="border p-3 text-center font-semibold w-1/6">Status</th>
              <th className="border p-3 text-center font-semibold w-1/6">Reason</th>
              <th className="border p-3 text-center font-semibold w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-100 bg-white text-gray-800">
          {teamProposals.length > 0 ? (
                teamProposals.map((proposal, index) => (
                  <tr
                  key={proposal.pid}
                  className={`border p-3 text-center ${
                    proposal.pid === officialProjectId ? "bg-gray-100 text-gray-900" : index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <td className="border border-gray-300 text-center border p-3">
                    {proposal.projectName} {proposal.pid === officialProjectId && "(Official Project)"}
                      </td>
                      <td className="border border-gray-300 text-center border p-3">{proposal.description}</td>
                      <td className="border border-gray-300 border p-3 break-words">
                        {proposal.features?.length > 0 ? (
                          <ul className="list-disc pl-4">
                            {proposal.features.map((f, i) => (
                              <li key={i} className="whitespace-normal">
                                <span className="font-semibold">{f.featureTitle}</span>: {f.featureDescription}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          "No Objectives"
                        )}
                      </td>
                      <td className="border border-gray-300 border p-3">{proposal.proposedByName}</td>
                      <td className="border border-gray-300 text-center border p-3">
                      <div className="flex flex-col items-center gap-2">
                    {getStatusBadge(proposal.status)}
                    {proposal.pid === officialProjectId && (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold inline-block bg-gray-700 text-white mt-1">
                        Official
                      </span>
                    )}
                    </div>
                  </td>
                      <td className="border border-gray-300 border p-3">{proposal.reason || "No reason provided"}</td>
                      <td className="border border-gray-300 border p-3 flex flex-col items-start gap-1">
                      <button
                        className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center space-x-2 group w-full"
                        onClick={() => openEditModal(proposal.pid)}
                      >
                        <Pencil className="h-4 w-4 text-cyan-500 group-hover:text-gray-800 transition-colors"  />
                        <span className="text-cyan-500 group-hover:text-gray-800 transition-colors">Edit Project</span>
                      </button>

                      {proposal.pid !== officialProjectId ? (
                        <button
                          className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center space-x-2 group w-full"
                          onClick={() => {
                            setModalMessage("Are you sure you want to set this project as the official project?");
                            setConfirmAction(() => () => handleSetOfficialProject(proposal.pid)); 
                            setIsModalOpen(true);
                          }}
                        >
                          <BadgeCheck className="h-4 w-4 text-green-500 group-hover:text-gray-800 transition-colors" />
                          <span className="text-green-500 group-hover:text-gray-800 transition-colors">Set as Official</span>
                        </button>
                      ) : (
                        <button
                          className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center space-x-2 group w-full"
                          onClick={() => {
                            setModalMessage("Are you sure you want to unset this project as the official project?");
                            setConfirmAction(() => handleUnsetOfficialProject);
                            setIsModalOpen(true);
                          }}
                        >
                          <BadgeX className="h-4 w-4 text-red-500 group-hover:text-gray-800 transition-colors" />
                          <span className="text-red-500 group-hover:text-gray-800 transition-colors">Unset Official</span>
                        </button>
                      )}

                      {proposal.pid !== officialProjectId && (
                        <button
                          className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center space-x-2 group w-full"
                          onClick={() => {
                            setModalMessage("Are you sure you want to delete this project?");
                            setConfirmAction(() => () => handleDeleteProposal(proposal.pid));
                            setIsModalOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500 group-hover:text-gray-800 transition-colors" />
                          <span className="text-red-500 group-hover:text-gray-800 transition-colors">Delete Project</span>
                        </button>
                      )}
                    {proposal.pid !== officialProjectId && (
                     <button
                        className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center space-x-2 group w-full"
                        onClick={() => {
                          setModalMessage("Are you sure you want to give this project?");
                          setConfirmAction(() => () => handleSetToOpenProject(proposal.pid));
                          setIsModalOpen(true);
                        }}
                      >
                        <PackageOpen className="h-4 w-4 text-violet-500 group-hover:text-gray-800 transition-colors" />
                        <span className="text-violet-500 group-hover:text-gray-800 transition-colors">Give Project</span>
                      </button>
                    )}
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
        </div>
        ) : null}

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

        <EditProjectProposalModal 
          proposalId={selectedProposalId} 
          isOpen={isEditModalOpen} 
          onClose={closeEditModal}
          refreshProposals={fetchTeamProposals} 
        />

      
        {activeTab === "suggested" ? (
          <>
            {/* Open Project Proposals Header */}
            <h2 className="text-xl font-semibold text-gray-700 mt-6">Suggested Project Proposals</h2>
            <p className="text-sm text-gray-500 mb-3">Explore abandoned projects available for reassignment and ownership.</p>

            {/* Open Project Proposals Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-700 text-white">
                  <tr>
                    {["Project Name", "Description", "Objectives", "Action"].map((header) => (
                      <th key={header} className="border p-3 text-center">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white text-gray-800 text-center">
                  {openProposals.length > 0 ? (
                    openProposals.map((proposal, index) => (
                      <tr key={proposal.pid} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                        <td className="border border-gray-300 text-center border p-3">{proposal.projectName}</td>
                        <td className="border border-gray-300 text-center border p-3">{proposal.description}</td>
                        <td className="border border-gray-300 text-center border p-3">
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
                        <td className="border border-gray-300 text-center p-3 flex justify-center">
                       <button
                         className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all flex items-center space-x-2 group"
                         onClick={() => {
                           setModalMessage("Are you sure you want to take ownership of this project?");
                           setConfirmAction(() => () => handleTakeOwnership(proposal.pid));
                           setIsModalOpen(true);
                         }}
                       >
                         <Crown className="h-4 w-4 text-green-500 group-hover:text-gray-800 transition-colors" />
                         <span className="text-green-500 group-hover:text-gray-800 transition-colors">Take Over</span>
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
          </>
        ) : null}
      </div>
    </div>
    </>
  );
};

export default ViewProjectProposal;