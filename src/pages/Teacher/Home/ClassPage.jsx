import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";

const ClassPage = () => {
  const { authState } = useContext(AuthContext);

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      {/* Main Content */}
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12 font-medium">
        <h1 className="text-2xl font-semibold mb-6">Class Page</h1>
      </div>
    </div>
  );
};

export default ClassPage;
