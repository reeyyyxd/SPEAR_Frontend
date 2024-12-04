import React from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import { useContext } from "react";

const ApplyTeamsPage = () => {
  const { authState } = useContext(AuthContext);

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      {/* Sidebar */}
      <Navbar userRole={authState.role} />
    </div>
  );
};

export default ApplyTeamsPage;
