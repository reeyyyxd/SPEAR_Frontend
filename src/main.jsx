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
import StudentClassPage from "./pages/Student/Home/StudentClassPage";
import TeacherTeams from "./pages/Teacher/Teams/TeacherTeams";
import TeamDetails from "./pages/Teacher/Teams/TeamDetails";
import TeacherEvaluations from "./pages/Teacher/Evaluation/TeacherEvaluations";
import ErrorPage from "./pages/Common/ErrorPage";
import TeacherQuestions from "./pages/Teacher/Evaluation/TeacherQuestions";
import ClassSettings from "./pages/Teacher/Home/ClassSettings";
import TeacherSettings from "./pages/Common/TeacherSettings";
import AdminSettings from "./pages/Common/AdminSettings";
import StudentSettings from "./pages/Common/StudentSettings";
import AdminRecycleBin from "./pages/Common/AdminRecycleBin"
import TeacherSchecules from "./pages/Teacher/Home/TeacherSchedules";
import AdviserCandidate from "./pages/Teacher/Home/AdviserCandidate";

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

  //student side
  {
    path: "/student-dashboard",
    element: (
      <PrivateRoute requiredRoles={["STUDENT"]}>
        <StudentDashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/class/:courseCode/:section",
    element: (
      <PrivateRoute requiredRoles={["STUDENT"]}>
        <StudentClassPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/student-settings",
    element: (
      <PrivateRoute requiredRoles={["STUDENT"]}>
        <StudentSettings />
      </PrivateRoute>
    ),
  },

  //teacher side


  {
    path: "/teacher/evaluations",
    element: (
      <PrivateRoute requiredRoles={["TEACHER"]}>
        <TeacherEvaluations />
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
    path: "/teacher-schedules",
    element: (
      <PrivateRoute requiredRoles={["TEACHER"]}>
        <TeacherSchecules />
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
    path: "/teacher/class/:courseCode/:section",
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
    path: "/teacher-settings",
    element: (
      <PrivateRoute requiredRoles={["TEACHER"]}>
        <TeacherSettings />
      </PrivateRoute>
    ),
  },
  {
    path: "/teacher/adviser-candidate",
    element: (
      <PrivateRoute requiredRoles={["TEACHER"]}>
        <AdviserCandidate />
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

  //admin side
  {
    path: "/admin-settings",
    element: (
      <PrivateRoute requiredRoles={["ADMIN"]}>
        <AdminSettings />
      </PrivateRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <PrivateRoute requiredRoles={["ADMIN"]}>
        <Settings />
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
    path: "/admin-recycle-bin",
    element: (
      <PrivateRoute requiredRoles={["ADMIN"]}>
        <AdminRecycleBin />
      </PrivateRoute>
    ),
  },

//other utilites 
  {
    path: "/notAuthorized",
    element: <NotAuthorized />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />{" "}
    </AuthProvider>
  </React.StrictMode>
);
