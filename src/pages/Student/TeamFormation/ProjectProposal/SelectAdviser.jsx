import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Navbar from "../../../../components/Navbar/Navbar";
import Header from "../../../../components/Header/Header";
import Advisers from "./Advisers/Advisers.jsx";
import AdviserDetails from "./Advisers/adviser-details"; 

const SelectAdviser = () => {
  const [selectedAdviser, setSelectedAdviser] = useState(null);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleSelectAdviser = (adviserName) => {
    setSelectedAdviser(adviserName); // Update the selected adviser
  };

  const handleViewSummary = () => {
    if (selectedAdviser) {
      // Navigate to the proposal summary page with the selected adviser
      navigate("/team-formation/project-proposal/proposal-summary", {
        state: { adviserName: selectedAdviser }, // Pass adviserName as state
      });
    } else {
      alert("Please select an adviser before viewing the summary.");
    }
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Select Adviser</h1>
          <Header />
        </div>
        <p className="my-16 text-center w-full">
          Meet the amazing faculty members at CIT-U College of Computer Studies!
          <br />
          Select an adviser whose skill & expertise is related to your project.
        </p>

        {/* Pass AdviserDetails and selection handler as props */}
        <Advisers
          advisers={AdviserDetails}
          selectedAdviser={selectedAdviser}
          onSelectAdviser={handleSelectAdviser}
        />
        <div className="flex mt-14">
          {/* Submit Button */}
          <button
            type="button"
            onClick={handleViewSummary} // Handle click to navigate
            className="flex ml-auto bg-teal text-white px-6 py-3 rounded-md hover:bg-peach transition text-md"
          >
            View Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectAdviser;
