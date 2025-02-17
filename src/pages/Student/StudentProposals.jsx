import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import AuthContext from "../../services/AuthContext";
import { toast } from "react-toastify";
import ApprovedProjectsTable from "../../components/Tables/ApprovedProjectsTable";
import axios from "axios";

const StudentProposals = () => {
  const { authState } = useContext(AuthContext);
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch proposals for the current student
  const fetchStudentProposals = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:8080/proposals/user/${authState.uid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      setProposals(response.data.proposals || []);
      console.log("Fetched Proposals:", response.data);
    } catch (err) {
      console.error("Error fetching student proposals:", err);
      toast.error("Failed to load your proposals. Please try again.");
      setError(err.response?.data?.message || "Failed to load proposals.");
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

        {isLoading ? (
          <p className="text-center text-gray-500">Loading proposals...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : proposals.length > 0 ? (
          <ApprovedProjectsTable proposals={proposals} />
        ) : (
          <p className="text-center text-gray-500">No approved projects found.</p>
        )}
      </div>
    </div>
  );
};

export default StudentProposals;
