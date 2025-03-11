import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from "../../../services/AuthContext";
import Navbar from "../../../components/Navbar/Navbar";
import axios from 'axios';
import { toast } from 'react-toastify';


const ViewProjectProposal = () => {
  const { authState, getDecryptedId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [teamProposals, setTeamProposals] = useState([]);
  const [openProposals, setOpenProposals] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const address = window.location.hostname;

  const classId = getDecryptedId("cid");
  const teamId = getDecryptedId("tid");
  const userId = authState.uid;

  useEffect(() => {
    fetchProposals();
  }, [classId, userId]);

  const fetchProposals = async () => {
    try {
      const token = authState.token;
      if (!token) throw new Error("No auth token");

      const teamResponse = await axios.get(
        `http://${address}:8080/proposals/class/${classId}/student/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const openResponse = await axios.get(
        `http://${address}:8080/proposals/class/${classId}/open-projects`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTeamProposals(teamResponse.data);
      setOpenProposals(openResponse.data);
    } catch (error) {
      toast.error("Error fetching proposals");
    }
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Project Proposals</h1>

        <button
        
        onClick={() => navigate(-1)}
        className="bg-teal text-white px-4 py-2 mb-4 rounded-md hover:bg-teal-dark transition" 
      >
        Back
      </button>
      <br />
        
        {/* Create Proposal Button */}
        {teamId && (
          <button 
            className="bg-teal text-white px-4 py-2 mb-4 rounded-md hover:bg-teal-dark transition" 
            onClick={() => navigate(`/student/project-proposal`)} 
          >
            Create Proposal
          </button>
        )}

        {/* My Team Proposals */}
        <h2 className="text-xl font-semibold mt-6 mb-3">My Team Proposals</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-teal text-white">
            <tr>
              <th className="border p-2">Project Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Features</th>
              <th className="border p-2">Proposed By</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamProposals.map((proposal) => (
              <tr key={proposal.pid} className="border-b">
                <td className="border p-2">{proposal.projectName}</td>
                <td className="border p-2">{proposal.description}</td>
                <td className="border p-2">
                  {proposal.features?.map((f) => (<div key={f.featureTitle}>{f.featureTitle}</div>))}
                </td>
                <td className="border p-2">{proposal.proposedBy}</td>
                <td className="border p-2">{proposal.status}</td>
                <td className="border p-2">
                  <button className="text-blue-500 hover:underline">Edit</button>
                  <button className="ml-2 text-green-500 hover:underline">Set Official</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Open Project Proposals */}
        <h2 className="text-xl font-semibold mt-6 mb-3">Open Project Proposals</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Project Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Features</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {openProposals.map((proposal) => (
              <tr key={proposal.pid} className="border-b">
                <td className="border p-2">{proposal.projectName}</td>
                <td className="border p-2">{proposal.description}</td>
                <td className="border p-2">
                  {proposal.features?.map((f) => (<div key={f.featureTitle}>{f.featureTitle}</div>))}
                </td>
                {/* create a button to take over the project */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewProjectProposal;