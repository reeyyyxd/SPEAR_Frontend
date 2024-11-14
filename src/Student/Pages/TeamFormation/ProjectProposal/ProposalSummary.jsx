import React from "react";
import Navbar from "../../../Components/Navbar/Navbar";
import Header from "../../../Components/Header/Header";
import sampleSummary from "../../../../sample-summary";
import cardContent from "../../../../card-content";
import AdviserDetails from "./Advisers/adviser-details";

const ProjectSummary = () => {
  // Select the first class and adviser
  const selectedClass = cardContent[0]; // Assuming cardContent has at least one item
  const selectedAdviser = AdviserDetails[1]; // Assuming AdviserDetails has at least one item

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar />
      <div className="main-content bg-white text-teal md:px-20 lg:px-32 pt-12 md:pt-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Project Summary</h1>
          <Header />
        </div>

        <div className="summary space-y-10 mx-auto">
          {sampleSummary.map((item, index) => (
            <div
              key={index}
              className="p-6 md:p-8 border border-gray-300 rounded-lg shadow-lg bg-gray-50"
            >
              {/* Display possible project title */}
              <h2 className="text-lg font-bold mb-2">
                Project Title: <span className="font-normal">{item.title}</span>
              </h2>

              {/* Display possible project overview */}
              <div className="text-lg mt-4">
                <span className="font-bold my-2">Project Overview:</span>
                <div>{item.overview}</div> {/* Changed to a div */}
              </div>

              {/* Display possible features */}
              <div className="features mt-4 space-y-3">
                <h3 className="text-lg font-bold">Possible Features:</h3>
                {item.features.map((feature, idx) => (
                  <div key={idx} className="ml-8">
                    <span className="text-base font-semibold text-peach">
                      {feature.title}:
                    </span>
                    <span className="text-base"> {feature.description}</span>
                  </div>
                ))}
              </div>

              {/* Display the selected class */}
              <div className="class-details mt-6">
                <p className="text-lg">
                  <span className="font-bold">Class:</span>{" "}
                  {selectedClass.courseCode} - {selectedClass.courseDescription}
                </p>
              </div>

              {/* Display the selected adviser */}
              <div className="adviser-details mt-6">
                <p className="text-lg">
                  <span className="font-bold">Selected Adviser:</span>{" "}
                  {selectedAdviser.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Proposal Button */}
        <button
          type="submit"
          className="flex ml-auto bg-teal text-white mt-16 px-8 py-3 rounded-lg hover:bg-peach transition text-lg font-semibold"
        >
          Submit Proposal
        </button>
      </div>
    </div>
  );
};

export default ProjectSummary;
