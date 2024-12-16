import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import AuthContext from "../../services/AuthContext";
import ProjectProposalService from "../../services/ProjectProposalService";
import { toast } from "react-toastify";

const StudentProposals = () => {
  const { authState, getDecryptedId } = useContext(AuthContext); // Access current user's auth state
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch proposals for the current student
  const fetchStudentProposals = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedProposals = await ProjectProposalService.getProposalsByUser(authState.uid);
      setProposals(fetchedProposals.proposals);
      console.log(fetchedProposals)
    } catch (err) {
      console.error("Error fetching student proposals:", err);
      toast.error("Failed to load your proposals. Please try again.");
      setError(err.message || "Failed to load proposals.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch proposals when component mounts
  useEffect(() => {
    fetchStudentProposals();
  }, []);

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        {/* Proposal Table */}
        <div>
          <h2 className="text-lg font-semibold mb-6 text-center text-teal">Your Proposals</h2>
          <div className="overflow-y-auto max-h-96 rounded-lg shadow-md">
            {isLoading ? (
              <p className="text-center text-gray-500">Loading your proposals...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : proposals.length > 0 ? (
              <table className="w-full bg-white rounded-lg shadow-md">
                <thead className="sticky top-0 bg-teal text-white z-20 shadow-lg">
                  <tr className="bg-teal font-medium text-white">
                    <th className="px-6 py-2 text-start text-md font-medium">Course Code</th>
                    <th className="px-6 py-2 text-start text-md font-medium">Project Title</th>
                    <th className="px-6 py-2 text-start text-md font-medium">Description</th>
                    <th className="px-6 py-2 text-start text-md font-medium">Status</th>
                    <th className="px-6 py-2 text-start text-md font-medium">Features</th>
                    <th className="px-6 py-2 text-start text-md font-medium">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {proposals.map((proposal) => (
                    <tr key={proposal.pid} className="hover:bg-gray-100">
                      <td className="py-2 px-4 text-teal-800">{proposal.courseCode || "N/A"}</td>
                      <td className="py-2 px-4 text-teal-800">{proposal.projectName || "N/A"}</td>
                      <td className="py-2 px-4 text-teal-800">{proposal.description || "N/A"}</td>
                      <td className="py-2 px-4 text-teal-800">{proposal.status || "N/A"}</td>
                      <td className="py-2 px-4 text-teal-800">
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
                      <td className="py-2 px-4 text-teal-800">
                        {proposal.reason || (proposal.status === "DENIED" ? "No reason provided" : "N/A")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500">You have no proposals submitted.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProposals;
