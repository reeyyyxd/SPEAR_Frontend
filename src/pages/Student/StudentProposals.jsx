import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import AuthContext from "../../services/AuthContext";
import ProjectProposalService from "../../services/ProjectProposalService";
import { toast } from "react-toastify";
import ApprovedProjectsTable from "../../components/Tables/ApprovedProjectsTable";

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
      const fetchedProposals = await ProjectProposalService.getProposalsByUser(
        authState.uid
      );
      setProposals(fetchedProposals.proposals);
      console.log(fetchedProposals);
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
        <div className="header flex justify-between items-center my-6">
          <h1 className="text-lg font-semibold">Your Approved Projects</h1>
        </div>

        <ApprovedProjectsTable />
      </div>
    </div>
  );
};

export default StudentProposals;
