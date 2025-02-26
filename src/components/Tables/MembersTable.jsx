import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../services/AuthContext";
import FormTeamModal from "../Modals/FormTeamModal";
import ApplyToTeamModal from "../Modals/ApplyToTeamModal";
import axios from "axios";

const MembersTable = () => {
  const { authState, getDecryptedId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [teamDetails, setTeamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFormTeamModal, setShowFormTeamModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [applyTeamId, setApplyTeamId] = useState(null);

  const address = getIpAddress();

  function getIpAddress() {
      const hostname = window.location.hostname;
      const indexOfColon = hostname.indexOf(':');
      return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }


  // Retrieve classId securely
  const classId = getDecryptedId("cid");

  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (!classId) {
        console.error("Class ID is missing. Unable to fetch team details.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const token = authState.token;
        if (!token) {
          console.error("Auth token is missing.");
          setLoading(false);
          return;
        }

        console.log(`Fetching teams with classId: ${classId} and uid: ${authState.uid}`);

        const response = await axios.get(
          `http://${address}:8080/team/my/${classId}/${authState.uid}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          setTeamDetails(response.data);
        } else {
          setTeamDetails(null);
        }
      } catch (error) {
        console.error("Error fetching team details:", error);
        setTeamDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [authState.uid, classId]);

  // Handle opening the Apply to Team Modal
  const handleOpenApplyModal = (teamId) => {
    setApplyTeamId(teamId);
  };

  // Handle closing the Apply to Team Modal
  const handleCloseApplyModal = () => {
    setApplyTeamId(null);
  };

  const handleFormTeamClick = (projectId) => {
    setSelectedProjectId(projectId);
    setShowFormTeamModal(true);
  };

  const TABLE_HEAD = ["Group Name", "Recruitment Status", "Leader", "Adviser", "Project Details", "Actions"];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-300 shadow-md mt-16 p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-gray-700 transition"
      >
        Back
      </button>

      <h2 className="text-lg font-semibold text-teal mb-4">Your Team</h2>

      {loading ? (
        <p className="text-center text-gray-500 p-4">Loading...</p>
      ) : teamDetails ? (
        <table className="w-full table-auto text-left">
          <thead className="bg-teal text-white">
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="p-4 text-sm font-semibold">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            <tr className="hover:bg-peach hover:text-white">
              <td className="p-4 border-b border-gray-300 text-sm">{teamDetails.groupName}</td>
              <td className="p-4 border-b border-gray-300 text-sm">
                {teamDetails.recruitmentOpen ? (
                  <button
                    onClick={() => handleOpenApplyModal(teamDetails.tid)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                  >
                    Apply
                  </button>
                ) : (
                  <span className="text-gray-500">Recruitment Closed</span>
                )}
              </td>
              <td className="p-4 border-b border-gray-300 text-sm">{teamDetails.leaderId}</td>
              <td className="p-4 border-b border-gray-300 text-sm">{teamDetails.adviserId}</td>
              <td className="p-4 border-b border-gray-300 text-sm">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-teal text-white py-2 px-4 rounded-lg hover:bg-peach"
                >
                  View Details
                </button>
              </td>
              <td className="p-4 border-b border-gray-300 text-sm">
                <button
                  onClick={() => handleFormTeamClick(teamDetails.projectId)}
                  className="bg-teal text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Form Team
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 p-4">
          You have currently no team.{" "}
          <button
            onClick={() => setShowFormTeamModal(true)}
            className="text-teal underline"
          >
            Create a Team
          </button>
          {" "}or{" "}
          <button
            onClick={() => navigate("/team-formation/apply-to-teams")}
            className="text-teal underline"
          >
            Apply to a Team
          </button>
        </p>
      )}

      {/* Apply to Team Modal */}
      {applyTeamId && (
        <ApplyToTeamModal teamId={applyTeamId} onClose={handleCloseApplyModal} />
      )}

      {/* Project Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-teal mb-4">Project Details</h2>
            <p className="mb-4">{teamDetails?.projectDescription || "No project details available."}</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-400 text-white py-2 px-4 rounded-lg mr-2 hover:bg-gray-600"
            >
              Close
            </button>
            <button
              onClick={() => console.log("Leave class functionality")}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700"
            >
              Leave Class
            </button>
          </div>
        </div>
      )}

      {/* Form Team Modal */}
      {showFormTeamModal && (
        <FormTeamModal
          onClose={() => setShowFormTeamModal(false)}
          projectId={selectedProjectId}
          classId={classId}
          leaderId={authState.uid}
        />
      )}
    </div>
  );
};

export default MembersTable;

//feyke (when there is team)
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const MembersTable = () => {
//   const navigate = useNavigate();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isRecruitmentModalOpen, setIsRecruitmentModalOpen] = useState(false);
//   const [declineReason, setDeclineReason] = useState("");

//   // Simulating logged-in user ID (Replace this with auth context)
//   const currentUserId = "John Doe"; // Example: Replace with actual logged-in user ID

//   // Static sample data
//   const teamDetails = {
//     groupName: "Team Alpha",
//     leaderId: "John Doe", // The user who created the team
//     adviserId: "Dr. Smith",
//     projectDescription: "AI-based smart assistant for customer support.",
//     projectId: "P001",
//     schedule: "Mondays & Wednesdays, 3:00 PM - 5:00 PM",
//     members: ["Alice Johnson", "Bob Williams", "Charlie Brown"],
//     features: ["Natural Language Processing", "Voice Recognition", "Data Analysis"],
//     recruitmentOpen: true,
//     pendingApplications: [
//       { id: 1, name: "Eve Adams" },
//       { id: 2, name: "Michael Lee" },
//     ],
//   };

//   const isLeader = currentUserId === teamDetails.leaderId;

//   const handleAcceptApplication = (applicant) => {
//     console.log(`Accepted ${applicant.name} into the team.`);
//   };

//   const handleDeclineApplication = (applicant) => {
//     console.log(`Declined ${applicant.name} with reason: ${declineReason}`);
//   };

//   const handleLeaveTeam = () => {
//     console.log("Leave team functionality triggered");
//   };

//   const TABLE_HEAD = ["Team Name", "Leader", "Members", "Adviser", "Official Project", "Schedule", "Recruitment", "Actions"];

//   return (
//     <div className="overflow-hidden rounded-2xl border border-gray-300 shadow-md mt-16 p-4">
//       {/* Back Button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="bg-gray-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-gray-700 transition"
//       >
//         Back
//       </button>

//       <h2 className="text-lg font-semibold text-teal mb-4">Your Team</h2>

//       <table className="w-full table-auto text-left">
//         <thead className="bg-teal text-white">
//           <tr>
//             {TABLE_HEAD.map((head) => (
//               <th key={head} className="p-4 text-sm font-semibold">
//                 {head}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="bg-gray-100">
//           <tr className="hover:bg-peach hover:text-white">
//             <td className="p-4 border-b border-gray-300 text-sm">{teamDetails.groupName}</td>
//             <td className="p-4 border-b border-gray-300 text-sm">{teamDetails.leaderId}</td>
//             <td className="p-4 border-b border-gray-300 text-sm">
//               {teamDetails.members.join(", ")}
//             </td>
//             <td className="p-4 border-b border-gray-300 text-sm">{teamDetails.adviserId}</td>
//             <td className="p-4 border-b border-gray-300 text-sm">{teamDetails.projectDescription}</td>
//             <td className="p-4 border-b border-gray-300 text-sm">{teamDetails.schedule}</td>
//             <td className="p-4 border-b border-gray-300 text-sm">{teamDetails.recruitmentOpen ? "Open" : "Closed"}</td>
//             <td className="p-4 border-b border-gray-300 text-sm">
//               {isLeader && (
//                 <button
//                   onClick={() => setIsRecruitmentModalOpen(true)}
//                   className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-2"
//                 >
//                   View Applications
//                 </button>
//               )}
//             </td>
//           </tr>
//         </tbody>
//       </table>

//       {/* Recruitment Modal */}
//       {isRecruitmentModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-lg font-semibold text-teal mb-4">Pending Applications</h2>
//             <ul className="mb-4">
//               {teamDetails.pendingApplications.map((applicant) => (
//                 <li key={applicant.id} className="text-gray-700 mb-2">
//                   {applicant.name}
//                   <button
//                     onClick={() => handleAcceptApplication(applicant)}
//                     className="bg-green-500 text-white py-1 px-3 rounded-lg ml-2 hover:bg-green-700"
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() => handleDeclineApplication(applicant)}
//                     className="bg-red-500 text-white py-1 px-3 rounded-lg ml-2 hover:bg-red-700"
//                   >
//                     Decline
//                   </button>
//                   <input
//                     type="text"
//                     placeholder="Reason for decline"
//                     onChange={(e) => setDeclineReason(e.target.value)}
//                     className="ml-2 border border-gray-300 p-1 rounded"
//                   />
//                 </li>
//               ))}
//             </ul>
//             <button
//               onClick={() => setIsRecruitmentModalOpen(false)}
//               className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MembersTable;
