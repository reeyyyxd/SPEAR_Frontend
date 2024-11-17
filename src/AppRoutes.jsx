import { Routes, Route, Link } from "react-router-dom";

//Student user imports
import Login from "./pages/Student/UserManagment/Login";
import Register from "./pages/Student/UserManagment/Register";
import StudentDashboard from "./pages/Student/Home/StudentDashboard";
import TeamFormation from "./pages/Student/TeamFormation/TeamFormation";
import Settings from "./pages/Student/Settings/Settings";
import LogOut from "./pages/Student/UserManagment/LogOut";
import ClassPage from "./pages/Student/Home/ClassPage";
import ProjectProposal from "./pages/Student/TeamFormation/ProjectProposal/ProjectProposal";
import TeamsApplication from "./pages/Student/TeamFormation/TeamsApplication/TeamsApplication";
import SelectAdviser from "./pages/Student/TeamFormation/ProjectProposal/SelectAdviser";
import ProposalSummary from "./pages/Student/TeamFormation/ProjectProposal/ProposalSummary";
import EvaluatePeers from "./pages/Student/Home/Classes/EvaluatePeers/EvaluatePeers";
import ProjectSummary from "./pages/Student/TeamFormation/TeamsApplication/ProjectSummary";

//Teacher user imports
import TeacherDashboard from "./pages/Teacher/Home/TeacherDashboard";
import TeacherSettings from "./pages/Teacher/Settings/TeacherSettings";
import ProjectProposals from "./pages/Teacher/ProjectProposals/ProjectProposals";
import CreateClass from "./pages/Teacher/Home/Classes/CreateClass";
import LandingPage from "./components/LandingPage/LandingPage";
import TeacherRegister from "./pages/Admin/Register/TeacherRegister";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Home route can guide users to choose between student/teacher login */}
      <Route path="/" element={<LandingPage />} />

      {/* Student Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Dashboard with nested routes */}
      <Route path="/home" element={<StudentDashboard />} />
      <Route path="/team-formation" element={<TeamFormation />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/log-out" element={<LogOut />} />
      <Route path="/class/:courseCode" element={<ClassPage />} />
      <Route
        path="/class/:courseCode/evaluate-peers"
        element={<EvaluatePeers />}
      />

      <Route
        path="/team-formation/project-proposal"
        element={<ProjectProposal />}
      />
      <Route
        path="/team-formation/teams-application"
        element={<TeamsApplication />}
      />
      <Route
        path="/team-formation/project-proposal/select-adviser"
        element={<SelectAdviser />}
      />
      <Route
        path="/team-formation/project-proposal/proposal-summary"
        element={<ProposalSummary />}
      />
      <Route
        path="/team-application/project-summary"
        element={<ProjectSummary />}
      />

      {/* Teacher Authentication Routes */}
      <Route path="/teacher/home" element={<TeacherDashboard />} />
      <Route path="/teacher/settings" element={<TeacherSettings />} />
      <Route path="/teacher/project-proposals" element={<ProjectProposals />} />
      <Route path="/teacher/create-class" element={<CreateClass />} />
      <Route path="/teacher/register" element={<TeacherRegister />} />

      {/* Admin Authentication Routes */}

      {/* Catch-all route for undefined URLs */}
      <Route path="*" element={<h1>Nothing Here..</h1>} />
    </Routes>
  );
}
