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
import TeamFormation from "./pages/Student/Home/TeamFormation";

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
    path: "/team-formation",
    element: (
      <PrivateRoute requiredRoles={["STUDENT"]}>
        <TeamFormation />
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
    path: "/class/:courseCode",
    element: (
      <PrivateRoute requiredRoles={["TEACHER"]}>
        <ClassPage />
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
    element: <h1>Nothing Here...</h1>,
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
