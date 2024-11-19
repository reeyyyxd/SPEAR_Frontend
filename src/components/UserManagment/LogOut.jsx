import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the user session (in case it's triggered from a URL like '/log-out')
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Redirect to login page
    navigate("/login");
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default LogOut;
