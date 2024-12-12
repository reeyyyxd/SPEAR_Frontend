import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./services/AuthContext";
import "./styles/index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LandingPage from "./pages/LandinPage/LandingPage";
import Login from "./components/UserAuthentication/Login";
import Register from "./components/UserAuthentication/Register";
import Settings from "./pages/Common/Settings";
import StudentDashboard from "./pages/Student/Home/StudentDashboard";
import ProjectProposals from "./pages/Teacher/ProjectProposals/ProjectProposals";
import TeacherDashboard from "./pages/Teacher/Home/TeacherDashboard";
import CreateClass from "./pages/Teacher/Home/CreateClass";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PrivateRoute from "./services/PrivateRoute";
import NotAuthorized from "./pages/Common/UnAuthorizedPage";
import ManageUsers from "./components/UserManagment/ManageUsers";
import ClassPage from "./pages/Teacher/Home/ClassPage";
import TeamFormation from "./pages/Student/TeamFormation/TeamFormation";
import StudentClassPage from "./pages/Student/Home/StudentClassPage";
import ProjectProposalPage from "./pages/Student/TeamFormation/ProjectProposalPage";
import ApplyTeamsPage from "./pages/Student/TeamFormation/ApplyTeamsPage";
import TeacherTeams from "./pages/Teacher/Teams/TeacherTeams";
import TeamDetails from "./pages/Teacher/Teams/TeamDetails";
import TeacherEvaluations from "./pages/Teacher/Evaluation/TeacherEvaluations";
import EvaluationPage from "./pages/Student/Home/EvaluationPage";
import ErrorPage from "./pages/Common/ErrorPage";
import TeacherQuestions from "./pages/Teacher/Evaluation/TeacherQuestions";
import ClassSettings from "./pages/Teacher/Home/ClassSettings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/student-dashboard",
    element: (
      <PrivateRoute requiredRoles={["STUDENT"]}>
        <StudentDashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/class/:courseCode/evaluate-peers",
    element: (
      <PrivateRoute requiredRoles={["STUDENT"]}>
        <EvaluationPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/team-formation",
    element: (
      <PrivateRoute requiredRoles={["STUDENT"]}>
        <TeamFormation />
      </PrivateRoute>
    ),
  },
  {
    path: "/team-formation/project-proposal",
    element: (
      <PrivateRoute requiredRoles={["STUDENT"]}>
        <ProjectProposalPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/team-formation/apply-to-teams",
    element: (
      <PrivateRoute requiredRoles={["STUDENT"]}>
        <ApplyTeamsPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/class/:courseCode",
    element: (
      <PrivateRoute requiredRoles={["STUDENT"]}>
        <StudentClassPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/teacher/evaluations",
    element: (
      <PrivateRoute requiredRoles={["TEACHER"]}>
        <TeacherEvaluations />
      </PrivateRoute>
    ),
  },

  {
    path: "/settings",
    element: (
      <PrivateRoute requiredRoles={["STUDENT", "TEACHER"]}>
        <Settings />
      </PrivateRoute>
    ),
  },
  {
    path: "/teacher-dashboard",
    element: (
      <PrivateRoute requiredRoles={["TEACHER"]}>
        <TeacherDashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/teacher/project-proposals",
    element: (
      <PrivateRoute requiredRoles={["TEACHER"]}>
        <ProjectProposals />
      </PrivateRoute>
    ),
  },
  {
    path: "/teacher/create-class",
    element: (
      <PrivateRoute requiredRoles={["TEACHER"]}>
        <CreateClass />
      </PrivateRoute>
    ),
  },
  {
    path: "/teacher/class/:courseCode",
    element: (
      <PrivateRoute requiredRoles={["TEACHER"]}>
        <ClassPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/team-details",
    element: (
      <PrivateRoute requiredRoles={["TEACHER"]}>
        <TeamDetails />
      </PrivateRoute>
    ),
  },
  {
    path: "/teacher/teams",
    element: (
      <PrivateRoute requiredRoles={["TEACHER"]}>
        <TeacherTeams />
      </PrivateRoute>
    ),
  },
  {
    path: "/class-settings",
    element: (
      <PrivateRoute requiredRoles={["TEACHER"]}>
        <ClassSettings />
      </PrivateRoute>
    ),
  },
  {
    path: "/teacher/questions/:eid",
    element: (
      <PrivateRoute requiredRoles={["TEACHER"]}>
        <TeacherQuestions />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin-dashboard",
    element: (
      <PrivateRoute requiredRoles={["ADMIN"]}>
        <AdminDashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/manage-users",
    element: (
      <PrivateRoute requiredRoles={["ADMIN"]}>
        <ManageUsers />
      </PrivateRoute>
    ),
  },
  {
    path: "/notAuthorized",
    element: <NotAuthorized />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />{" "}
    </AuthProvider>
  </React.StrictMode>
);
