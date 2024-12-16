import React, { useContext, useState, useEffect } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import TeamRecruitmentService from "../../../services/TeamRecuitmentService";
import { useNavigate, useParams } from "react-router-dom";

const TeamApplication = () => {
  const { authState } = useContext(AuthContext);
  const { teamId } = useParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Initially false since no action is happening
  const [role, setRole] = useState("");
  const [reason, setReason] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      // Constructing the application data payload
      const applicationData = {
        teamId : parseInt(teamId), // Team ID extracted from the URL
        userId: parseInt(authState.uid), // Current user's ID from authState
        role,   // Role provided by the user in the form
        reason, // Reason provided by the user in the form
      };
      console.log("Submitted Payload:", applicationData); // Log application data for debugging
  
      // Call the API to apply to the team
      const response = await TeamRecruitmentService.applyToTeam(applicationData, authState.token);
      console.log("API Response:", response); // Log API response for debugging
  
      // Handling the response from the API
      if (response.success) {
        // Navigate to a success or confirmation page
        navigate(`/team-formation/apply-to-teams`);
      } else {
        setError(response.message || "Failed to submit the application.");
      }
    } catch (error) {
      // Error handling similar to axios example
      console.log('Error during form submission:');
      
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.log('Response error:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
        setError(`Backend error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.log('Request error:', error.request);
        setError('No response received from the server. Please check your network.');
      } else {
        // Something happened in setting up the request
        console.log('Error message:', error.message);
        setError(`Error: ${error.message}`);
      }
  
      console.log('Error config:', error.config); // Log the axios configuration if needed
    } finally {
      // Reset loading state after the API call is completed
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
          <form onSubmit={handleSubmit}> {/* Add onSubmit here */}
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
