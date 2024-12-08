import React from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import { useContext } from "react";
import ApplyTeamsTable from "../../../components/Tables/ApplyTeamsTable";

const ApplyTeamsPage = () => {
  const { authState } = useContext(AuthContext);

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      {/* Sidebar */}
      <Navbar userRole={authState.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">Welcome, Student</h1>
        </div>
        <ApplyTeamsTable />
      </div>
    </div>
  );
};

export default ApplyTeamsPage;
