import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import ProjectProposalService from "../../services/ProjectProposalService";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [proposals, setProposals] = useState([]);
  const [status, setStatus] = useState("approved"); // Default status filter
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch proposals by status
  const fetchProposals = async (selectedStatus) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedProposals = await ProjectProposalService.getProposalsByStatus(selectedStatus);
      setProposals(fetchedProposals);
    } catch (err) {
      console.error("Error fetching proposals:", err);
      toast.error("Failed to load proposals. Please try again.");
      setError(err.message || "Failed to load proposals.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch proposals when the status changes
  useEffect(() => {
    fetchProposals(status);
  }, [status]);

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={"ADMIN"} />
      <div className="p-4">
        <h1 className="text-lg font-semibold mb-4">Admin Dashboard</h1>
        <div className="flex justify-between items-center mb-4">
          <label htmlFor="statusFilter" className="font-medium text-gray-700">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="open">Open</option>
            <option value="approved">Approved</option>
            <option value="denied">Denied</option>
          </select>
        </div>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading proposals...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <ProposalsTable proposals={proposals} />
        )}
      </div>
    </div>
  );
};

const ProposalsTable = ({ proposals }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Project Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Reason</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Features</th>
          </tr>
        </thead>
        <tbody>
          {proposals.length > 0 ? (
            proposals.map((proposal) => (
              <tr key={proposal.pid}>
                <td className="border border-gray-300 px-4 py-2">
                  {proposal.projectName || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {proposal.description || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {proposal.status || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {proposal.reason || (proposal.status === "DENIED" ? "No reason provided" : "N/A")}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {proposal.features.length > 0 ? (
                    <ul className="list-disc ml-4">
                      {proposal.features.map((feature, index) => (
                        <li key={index}>
                          <strong>{feature.featureTitle}:</strong> {feature.featureDescription}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No features"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-gray-500 py-4">
                No proposals available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
