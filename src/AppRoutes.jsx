import { Routes, Route, Link } from "react-router-dom";
import Login from "./Student/UserManagment/Login";
import Register from "./Student/UserManagment/Register";
import TeacherLogin from "./Teacher/UserManagement/TeacherLogin";
import TeacherRegister from "./Teacher/UserManagement/TeacherRegister";
import AdminLogin from "./Admin/Login/AdminLogin";
import StudentDashboard from "./Student/Home/StudentDashboard";
import TeamFormation from "./Student/TeamFormation/TeamFormation";
import Settings from "./Student/Settings/Settings";
import LogOut from "./Student/UserManagment/LogOut";
import ClassPage from "./Student/Home/Classes/ClassPage";
import ProjectProposal from "./Student/TeamFormation/ProjectProposal/ProjectProposal";
import TeamsApplication from "./Student/TeamFormation/TeamsApplication/TeamsApplication";
import SelectAdviser from "./Student/TeamFormation/ProjectProposal/SelectAdviser";
import ProjectSummary from "./Student/TeamFormation/ProjectProposal/ProjectSummary";
import EvaluatePeers from "./Student/Home/Classes/EvaluatePeers/EvaluatePeers";
import TeacherDashboard from "./Teacher/Home/TeacherDashboard";
import TeacherSettings from "./Teacher/Settings/TeacherSettings";
import ProjectProposals from "./Teacher/ProjectProposals/ProjectProposals";
import CreateClass from "./Teacher/Home/Classes/CreateClass";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Home route can guide users to choose between student/teacher login */}
      <Route path="/" element={<Link to="/login">Go to Login</Link>} />

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
        element={<ProjectSummary />}
      />

      {/* Teacher Authentication Routes */}
      <Route path="/teacher/login" element={<TeacherLogin />} />
      <Route path="/teacher/register" element={<TeacherRegister />} />
      <Route path="/teacher/home" element={<TeacherDashboard />} />
      <Route path="/teacher/settings" element={<TeacherSettings />} />
      <Route path="/teacher/project-proposals" element={<ProjectProposals />} />
      <Route path="/teacher/create-class" element={<CreateClass />} />

      {/* Admin Authentication Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Catch-all route for undefined URLs */}
      <Route path="*" element={<h1>Nothing Here..</h1>} />
    </Routes>
  );
}
