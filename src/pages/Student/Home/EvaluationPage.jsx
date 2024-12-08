import React from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";

const EvaluationPage = () => {
  const { authState } = React.useContext(AuthContext);

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        Evaluate peers
      </div>
    </div>
  );
};

export default EvaluationPage;
