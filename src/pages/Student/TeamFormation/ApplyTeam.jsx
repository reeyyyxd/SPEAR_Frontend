import React, { useEffect, useState, useContext } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../services/AuthContext";
import ApplyTeamModal from "../../../components/Modals/ApplyTeamModal";
import axios from "axios";

const ApplyTeam = () => {
  const { authState } = useContext(AuthContext);
  const [openTeams, setOpenTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null); // State to track selected team for modal
  const navigate = useNavigate();

  const address = getIpAddress();

  function getIpAddress() {
    const hostname = window.location.hostname;
    const indexOfColon = hostname.indexOf(":");
    return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  useEffect(() => {
    const fetchOpenTeams = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://${address}:8080/teams/open-for-recruitment`);
        if (response.status === 200 && response.data) {
          setOpenTeams(response.data);
        }
      } catch (error) {
        console.error("Error fetching open teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenTeams();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-teal">Loading...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="main-content bg-white text-gray-900 md:px-20 lg:px-28 pt-8 md:pt-12">
  
          {/* Back Button at the Top */}
          <div className="mb-4">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600"
            >
              Back
            </button>
          </div>

          {/* Header Section */}
          <div className="header mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Apply Team</h1>
            <p className="text-lg font-semibold text-teal-600 mt-2">Open Teams for Recruitment</p>
          </div>

        {/* Open Teams Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400 rounded-lg shadow-md">
            <thead>
              <tr className="bg-teal-600 text-black">
                <th className="border border-gray-400 px-6 py-3 text-left text-black">Team Name</th>
                <th className="border border-gray-400 px-6 py-3 text-left text-black">Leader</th>
                <th className="border border-gray-400 px-6 py-3 text-left text-black">Members</th>
                <th className="border border-gray-400 px-6 py-3 text-left text-black">Project Name</th>
                <th className="border border-gray-400 px-6 py-3 text-left text-black">Description</th>
                <th className="border border-gray-400 px-6 py-3 text-left text-black"> </th>  
              </tr>
            </thead>
            <tbody>
              {openTeams.length > 0 ? (
                openTeams.map((team) => (
                  <tr key={team.tid} className="hover:bg-gray-100">
                    <td className="border border-gray-400 px-6 py-3 text-gray-900">{team.groupName}</td>
                    <td className="border border-gray-400 px-6 py-3 text-gray-900">{team.leaderName}</td>

                    <td className="border border-gray-400 px-6 py-3 text-gray-900">
                      {team.memberIds ? `${team.memberIds.length}/${team.maxMembers || "N/A"}` : `0/${team.maxMembers || "N/A"}`}
                    </td>

                    <td className="border border-gray-400 px-6 py-3 text-gray-900">{team.projectName || "No Project Assigned"}</td>
                    <td className="border border-gray-400 px-6 py-3 text-gray-900">{team.projectDescription || "No Description Available"}</td>

                    {/* Apply Button */}
                    <td className="border border-gray-400 px-6 py-3 text-center">
                      <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md border border-blue-800 hover:bg-blue-700"
                        style={{ backgroundColor: "#2563EB", color: "#ffffff", border: "2px solid #1E40AF" }}
                        onClick={() => setSelectedTeam(team.tid)} // Open modal with team ID
                      >
                        Apply Team
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center border border-gray-400 px-6 py-3 text-gray-900">
                    No open teams available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Team Modal (Shows only if selectedTeam is set) */}
      {selectedTeam && (
        <ApplyTeamModal 
          teamId={selectedTeam} 
          onClose={() => setSelectedTeam(null)} // Close modal
        />
      )}
    </div>
  );
};

export default ApplyTeam;