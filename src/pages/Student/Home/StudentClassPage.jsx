import React, { useEffect, useState, useContext } from "react";
import { useParams , useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import MembersTable from "../../../components/Tables/MembersTable";
import axios from "axios";
import { FileText, Settings, UserPlus , ChevronRight , Users , UserRoundPlus} from "lucide-react"
import AddTeamMembersModal from "../../../components/Modals/AddTeamMembersModal";

const StudentClassPage = () => {
  const { authState, storeEncryptedId , getDecryptedId  } = useContext(AuthContext);
  const navigate = useNavigate();
  const { courseCode, section } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalMembers, setTotalMembers] = useState(0);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [teacherName, setTeacherName] = useState("");
  const [creatorName, setCreatorName] = useState(""); // Store creator's name
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const address = getIpAddress();
  const classId = getDecryptedId("cid");
  const userId = authState.uid;
  const [teamId, setTeamId] = useState(getDecryptedId("tid") || authState.teamId || null);

  function getIpAddress() {
    const hostname = window.location.hostname;
    const indexOfColon = hostname.indexOf(":");
    return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  useEffect(() => {
    const fetchClassDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://${address}:8080/class/${courseCode}/${section}`);
        
        if (response.status === 200 && response.data?.classes) {
          const classData = response.data.classes;
          setClassDetails(classData);
          storeEncryptedId("cid", classData.cid);
          fetchTotalMembers(classData.cid);
          
          setTeacherName(classData.teacherName || "Unknown Teacher");
          setCreatorName(
            response.data.createdByFirstname && response.data.createdByLastname
              ? `${response.data.createdByFirstname} ${response.data.createdByLastname}`
              : "Unknown Creator"
          );
  
        } else {
          setClassDetails(null);
        }
      } catch (error) {
        console.error("Error fetching class details:", error);
        setClassDetails(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchClassDetails();
  }, [courseCode, section, storeEncryptedId]);

  const fetchTotalMembers = async (classId) => {
    try {
      const response = await axios.get(`http://${address}:8080/class/${classId}/total-users`);
      if (response.status === 200) {
        setTotalMembers(response.data);
      }
    } catch (error) {
      console.error("Error fetching total members:", error);
    }
  };

  const handleTeamSettingsClick = () => {
    let latestTeamId = getDecryptedId("tid") || teamId;
  
    if (!classId || !latestTeamId || !userId) {
      console.error("Missing parameters for navigation:", { classId, latestTeamId, userId });
      return;
    }
  
    storeEncryptedId("tid", latestTeamId);
  
    navigate(`/student-team-settings/${classId}/${latestTeamId}/${userId}`);
  };

  const handleAddMembersClick = () => {
    setIsAddMemberModalOpen(true);
  };

  useEffect(() => {
    if (classId && authState.uid) {
      fetchTeamDetails();
    }
  }, [classId, authState.uid]);
 
  const fetchTeamDetails = async () => {
    try {
      const token = authState.token; // Ensure token is correctly retrieved
      const response = await axios.get(
        `http://${address}:8080/team/my/${classId}/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200 && response.data) {
        const latestTeamId = response.data.tid;
        
        if (latestTeamId) {
          setTeamId(latestTeamId);
          storeEncryptedId("tid", latestTeamId);
        }
      }
    } catch (error) {
      console.error("Error fetching team details:", error);
    }
  };
  
  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://${address}:8080/class/${classDetails.classKey}/students`);
      if (response.status === 200) {
        setStudents(response.data);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-teal">Loading...</p>
      </div>
    );
  }

  if (!classDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-red-500">Class details not found.</p>
      </div>
    );
  } 

  return (
    <div className="grid grid-cols-1 md:grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="main-content bg-white text-teal px-6 sm:px-12 md:px-20 lg:px-28 pt-8 md:pt-12">
        {/* Header Section */}
        <button
        onClick={() => navigate(-1)}
        className="bg-gray-700 text-white px-4 py-2 rounded-lg mb-10 hover:bg-gray-500 transition"
      >
        Back
      </button>
        <div className="header flex justify-between items-center mb-2">
          <div>
            <h1 className="text-2xl font-bold">
              {classDetails.courseCode} - {classDetails.courseDescription} - {classDetails.section}
            </h1>
            <p className="text-gray-600">
              Class Creator: {creatorName}
            </p>
          </div>
          <button
          className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all flex items-center space-x-2"
          onClick={fetchStudents}
        >
          <Users className="h-4 w-4 sm:h-4 sm:w-4"/>
          <span className="font-semibold">Class Members ({totalMembers})</span>
        </button>
        </div>

        {/* Members Table */}
        <MembersTable className="-mt-20" />

        {/* Members Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 sm:p-6 rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/3 max-h-[90vh] overflow-y-auto relative">
              {/* Header Section */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Class Members</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowModal(false)}
                >
                  ✖
                </button>
              </div>

              {/* Members List */}
              <div className="max-h-60 overflow-y-auto">
                <ul className="space-y-3">
                  {students.slice(0, 10).map((student, index) => (
                    <li key={index} className="border-b pb-2">
                      <p className="text-gray-800 font-medium">
                        {student.firstname} {student.lastname}
                      </p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                      {student.role === "TEACHER" && (
                        <p className="text-xs text-teal-500 font-bold">Teacher</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

  <div className="space-y-4 pt-10">
    <h2 className="text-2xl font-semibold text-teal-500">Actions</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <button 
    className={`border px-3 py-1.5 rounded-lg transition flex items-center justify-between w-full h-12 
      ${teamId ? "border-gray-300 hover:bg-gray-200 cursor-pointer" : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"}`}
    onClick={teamId ? () => navigate(`/student/view-project-proposal`) : undefined}
    disabled={!teamId}
  >
    <div className="flex items-center gap-2">
      <FileText className="h-4 w-4" />
      <span className="text-sm font-semibold">Project Proposal</span>
    </div>
    <ChevronRight className="h-4 w-4" />
  </button>

  <button 
  className={`border px-3 py-1.5 rounded-lg transition flex items-center justify-between w-full h-12 
    ${teamId ? "border-gray-300 hover:bg-gray-200 cursor-pointer" : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"}`}
  onClick={teamId ? handleTeamSettingsClick : undefined}
  disabled={!teamId}
>
  <div className="flex items-center gap-2">
    <Settings className="h-4 w-4" />
    <span className="text-sm font-semibold">Team Settings</span>
  </div>
  <ChevronRight className="h-4 w-4" />
</button>

</div>

<button 
  className={`bg-gray-700 text-white px-4 py-2 rounded-lg mb-10 transition flex items-center justify-between w-30 h-12 
    ${teamId ? "hover:bg-gray-500 cursor-pointer" : "bg-gray-400 cursor-not-allowed"}`}
  onClick={teamId ? () => setIsAddMemberModalOpen(true) : undefined}
  disabled={!teamId}
>
  <UserPlus className="h-5 w-5 mr-2" />
  <span className="text-sm font-semibold">Add Members</span>
</button>


    {isAddMemberModalOpen && (
              <AddTeamMembersModal 
              isOpen={isAddMemberModalOpen} 
              onClose={() => setIsAddMemberModalOpen(false)} 
              teamId={teamId} 
              classId={classId} />
            )}
          </div>

      </div>
    </div>
  );
};


export default StudentClassPage;