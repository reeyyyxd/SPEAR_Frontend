import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./services/PrivateRoute";

// Student user imports
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

// Teacher user imports
import TeacherDashboard from "./pages/Teacher/Home/TeacherDashboard";
import TeacherSettings from "./pages/Teacher/Settings/TeacherSettings";
import ProjectProposals from "./pages/Teacher/ProjectProposals/ProjectProposals";
import CreateClass from "./pages/Teacher/Home/Classes/CreateClass";
import TeacherRegister from "./pages/Admin/Register/TeacherRegister";

// Admin user imports
import TeacherRegisterAdmin from "./pages/Admin/Register/TeacherRegister"; // For registering teachers as admin

// Landing Page Component
import LandingPage from "./components/LandingPage/LandingPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Home route can guide users to choose between student/teacher login */}
      <Route path="/" element={<LandingPage />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Student Routes */}
      <Route
        path="/home"
        element={
          <PrivateRoute requiredRoles={["STUDENT"]}>
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/team-formation"
        element={
          <PrivateRoute requiredRoles={["STUDENT"]}>
            <TeamFormation />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute requiredRoles={["STUDENT"]}>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route
        path="/log-out"
        element={
          <PrivateRoute requiredRoles={["STUDENT"]}>
            <LogOut />
          </PrivateRoute>
        }
      />
      <Route
        path="/class/:courseCode"
        element={
          <PrivateRoute requiredRoles={["STUDENT"]}>
            <ClassPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/team-formation/project-proposal"
        element={
          <PrivateRoute requiredRoles={["STUDENT"]}>
            <ProjectProposal />
          </PrivateRoute>
        }
      />
      <Route
        path="/team-formation/teams-application"
        element={
          <PrivateRoute requiredRoles={["STUDENT"]}>
            <TeamsApplication />
          </PrivateRoute>
        }
      />
      <Route
        path="/team-formation/project-proposal/select-adviser"
        element={
          <PrivateRoute requiredRoles={["STUDENT"]}>
            <SelectAdviser />
          </PrivateRoute>
        }
      />
      <Route
        path="/team-formation/project-proposal/proposal-summary"
        element={
          <PrivateRoute requiredRoles={["STUDENT"]}>
            <ProposalSummary />
          </PrivateRoute>
        }
      />
      <Route
        path="/team-application/project-summary"
        element={
          <PrivateRoute requiredRoles={["STUDENT"]}>
            <ProjectSummary />
          </PrivateRoute>
        }
      />
      <Route
        path="/class/:courseCode/evaluate-peers"
        element={
          <PrivateRoute requiredRoles={["STUDENT"]}>
            <EvaluatePeers />
          </PrivateRoute>
        }
      />

      {/* Protected Teacher Routes */}
      <Route
        path="/teacher/home"
        element={
          <PrivateRoute requiredRoles={["TEACHER"]}>
            <TeacherDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/settings"
        element={
          <PrivateRoute requiredRoles={["TEACHER"]}>
            <TeacherSettings />
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/project-proposals"
        element={
          <PrivateRoute requiredRoles={["TEACHER"]}>
            <ProjectProposals />
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/create-class"
        element={
          <PrivateRoute requiredRoles={["TEACHER"]}>
            <CreateClass />
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/register"
        element={
          <PrivateRoute requiredRoles={["ADMIN"]}>
            <TeacherRegister />
          </PrivateRoute>
        }
      />

      {/* Catch-all route for undefined URLs */}
      <Route path="*" element={<h1>Nothing Here..</h1>} />
    </Routes>
  );
}
