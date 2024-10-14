import { Routes, Route, Link } from "react-router-dom";
import Login from "./Student/Login/Login";
import Register from "./Student/Register/Register";
import TeacherLogin from "./Teacher/Login/TeacherLogin";
import TeacherRegister from "./Teacher/Register/TeacherRegister";
import AdminLogin from "./Admin/Login/AdminLogin";
import StudentDashboard from "./Student/Home/StudentDashboard";
import TeamFormation from "./Student/TeamFormation/TeamFormation";
import Settings from "./Student/Settings/Settings";
import LogOut from "./Student/LogOut/LogOut";
import ClassPage from "./Student/Home/ClassPage";
import ProjectProposal from "./Student/TeamFormation/ProjectProposal/ProjectProposal";
import TeamsApplication from "./Student/TeamFormation/TeamsApplication/TeamsApplication";

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
        path="/team-formation/project-proposal"
        element={<ProjectProposal />}
      />
      <Route
        path="/team-formation/teams-application"
        element={<TeamsApplication />}
      />

      {/* Teacher Authentication Routes */}
      <Route path="/teacher/login" element={<TeacherLogin />} />
      <Route path="/teacher/register" element={<TeacherRegister />} />

      {/* Admin Authentication Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Catch-all route for undefined URLs */}
      <Route path="*" element={<h1>Nothing Here..</h1>} />
    </Routes>
  );
}
