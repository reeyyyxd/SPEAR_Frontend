import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import ViewProposalAdviserModal from "../../../components/Modals/ViewProposalsAdviserModal";
import axios from "axios";

const TeacherAdvisories = () => {
  const { authState, storeEncryptedId } = useContext(AuthContext);
  const [advisoryTeams, setAdvisoryTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const address = getIpAddress();

  function getIpAddress() {
    const hostname = window.location.hostname;
    const indexOfColon = hostname.indexOf(":");
    return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  useEffect(() => {
    const fetchAdvisoryTeams = async () => {
      if (!authState.uid) {
        console.error("Adviser ID is missing. Ensure you are logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://${address}:8080/teacher/teams/adviser/${authState.uid}`, {
          headers: { Authorization: `Bearer ${authState.token}` },
        });

        if (response.status === 200) {
          setAdvisoryTeams(response.data);
        }
      } catch (error) {
        console.error("Error fetching advisory teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisoryTeams();
  }, [authState]);

  const handleViewProposals = (teamId) => {
    storeEncryptedId("tid", teamId);
    setIsModalOpen(true); 
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-teal">Loading advisories...</p>
      </div>
    );
  }

  

  return (
            <div className="grid grid-cols-[256px_1fr] min-h-screen">
              <Navbar userRole={authState?.role} />
              <div className="main-content bg-white text-gray-900 md:px-20 lg:px-28 pt-8 md:pt-12">
                
                {/* Back Button */}
                <div className="flex justify-start mb-4">
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700" onClick={() => navigate(-1)}>
                    Back
                  </button>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">My Advisories</h1>

                <div className="bg-gray-100 shadow-md rounded-lg p-6">
          {advisoryTeams.length > 0 ? (
            <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr className="bg-teal-500 text-black">
                  <th className="px-6 py-3 text-left text-sm font-bold">Group Name</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Leader</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Members</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Course</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Schedule</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {advisoryTeams.map((team) => (
                  <tr key={team.tid} className="hover:bg-gray-100">
                    {/* Group Name */}
                    <td className="px-6 py-4 text-sm text-gray-900">{team.groupName}</td>
                    
                    {/* Leader Name */}
                    <td className="px-6 py-4 text-sm text-gray-900">{team.leaderName || "N/A"}</td>
                    
                    {/* Members (Bullet List) */}
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {team.memberNames.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {team.memberNames.map((member, index) => (
                            <li key={index}>{member}</li>
                          ))}
                        </ul>
                      ) : (
                        "No Members"
                      )}
                    </td>

                    {/* Course Description */}
                    <td className="px-6 py-4 text-sm text-gray-900">{team.courseDescription || "No Course Info"}</td>

                    {/* Schedule */}
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="font-semibold">{team.scheduleDay}</span> <br />
                      {team.scheduleTime}
                    </td>

                    {/* View Project Proposals Button */}
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <button
                        className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                        onClick={() => handleViewProposals(team.tid)}
                      >
                        View Proposals
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center">No advisories assigned.</p>
          )}
        </div>
      </div>
      {isModalOpen && <ViewProposalAdviserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
    
  );
};

export default TeacherAdvisories;