import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";

const TeamApplication = () => {
  const { authState } = useContext(AuthContext);
  const { teamId } = useParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [reason, setReason] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Construct the application data payload
      const applicationData = {
        teamId: parseInt(teamId),
        userId: parseInt(authState.uid),
        role,
        reason,
      };

      console.log("Submitted Payload:", applicationData);

      // Call the API to apply to the team
      const response = await fetch("http://localhost:8080/student/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify(applicationData),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to submit the application.");
      }

      // Navigate to a success or confirmation page
      navigate(`/team-formation/apply-to-teams`);
    } catch (error) {
      console.error("Error during form submission:", error);
      setError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Team ID:", teamId);
  }, [teamId]);

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />

      {/* Main Content */}
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        {/* Header Section */}
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold my-6">Team Application</h1>
        </div>

        {/* Form Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-semibold mb-2">
                Role to fill
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md bg-white"
                placeholder="Enter position"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="reason" className="block text-sm font-semibold mb-2">
                Why Am I a Great Fit for the Team
              </label>
              <textarea
                type="text"
                className="w-full p-2 border rounded-md bg-white"
                placeholder="Provide a brief reason"
                rows="4"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="text-right mt-6">
              <button
                type="submit"
                className={`w-1/6 h-1/4 ml-4 p-4 text-sm text-center rounded-lg ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-teal hover:bg-peach text-white"
                }`}
                disabled={loading} // Disable button during loading
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 text-red-600 font-semibold">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamApplication;
