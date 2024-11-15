import { Routes, Route, Link } from "react-router-dom";
import Login from "./Student/Pages/UserManagment/Login";
import Register from "./Student/Pages/UserManagment/Register";
import StudentDashboard from "./Student/Pages/Home/StudentDashboard";
import TeamFormation from "./Student/Pages/TeamFormation/TeamFormation";
import Settings from "./Student/Pages/Settings/Settings";
import LogOut from "./Student/Pages/UserManagment/LogOut";
import ClassPage from "./Student/Pages/Home/Classes/ClassPage";
import ProjectProposal from "./Student/Pages/TeamFormation/ProjectProposal/ProjectProposal";
import TeamsApplication from "./Student/Pages/TeamFormation/TeamsApplication/TeamsApplication";
import SelectAdviser from "./Student/Pages/TeamFormation/ProjectProposal/SelectAdviser";
import ProposalSummary from "./Student/Pages/TeamFormation/ProjectProposal/ProposalSummary";
import EvaluatePeers from "./Student/Pages/Home/Classes/EvaluatePeers/EvaluatePeers";
import TeacherDashboard from "./Teacher/Pages/Home/TeacherDashboard";
import TeacherSettings from "./Teacher/Pages/Settings/TeacherSettings";
import ProjectProposals from "./Teacher/Pages/ProjectProposals/ProjectProposals";
import CreateClass from "./Teacher/Pages/Home/Classes/CreateClass";
import ProjectSummary from "./Student/Pages/TeamFormation/TeamsApplication/ProjectSummary";
import LandingPage from "./LandingPage";

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

      {/* Admin Authentication Routes */}

      {/* Catch-all route for undefined URLs */}
      <Route path="*" element={<h1>Nothing Here..</h1>} />
    </Routes>
  );
}
