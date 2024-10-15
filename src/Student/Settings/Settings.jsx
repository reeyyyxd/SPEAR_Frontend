import React from "react";
import Navbar from "../Navbar/Navbar";

const Settings = () => {
  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar />
      <div className="main-content bg-white text-teal p-4">Settings</div>
    </div>
  );
};

export default Settings;
