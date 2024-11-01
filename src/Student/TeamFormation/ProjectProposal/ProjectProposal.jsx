import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";
import cardContent from "../../../card-content";

const ProjectProposal = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [course, setCourse] = useState("");
  const [projectOverview, setProjectOverview] = useState("");
  const [isCapstone, setIsCapstone] = useState(false); // Track if the course is a capstone
  const navigate = useNavigate(); // To handle routing

  const handleCourseChange = (e) => {
    const selectedCourse = e.target.value;
    setCourse(selectedCourse);

    // Check if the selected course is a capstone (ensure `isCapstone` is a boolean)
    const selectedCourseInfo = cardContent.find(
      (course) => course.courseCode === selectedCourse
    );
    if (selectedCourseInfo && selectedCourseInfo.isCapstone === "true") {
      setIsCapstone(true);
    } else {
      setIsCapstone(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Assuming all required fields are filled, navigate based on course type
    if (isCapstone) {
      // Route to adviser selection if capstone
      navigate("/team-formation/project-proposal/select-adviser", {
        state: { projectTitle, course, projectOverview },
      });
    } else {
      // Route directly to proposal summary if not capstone
      navigate("/team-formation/project-proposal/proposal-summary", {
        state: { projectTitle, course, projectOverview },
      });
    }
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="welcome">
          <h1 className="text-3xl font-semibold my-6">Project Proposal</h1>

          {/* Project Proposal Form */}
          <div className="form-field">
            <form className="space-y-10" onSubmit={handleSubmit}>
              {/* Grid for Project Title and Course Selection */}
              <div className="grid grid-cols-2 gap-8">
                {/* Project Title */}
                <div className="form-group">
                  <label
                    htmlFor="project-title"
                    className="block text-base font-medium text-teal"
                  >
                    Project Title
                  </label>
                  <input
                    type="text"
                    id="project-title"
                    className="mt-2 block w-full border border-gray-300 rounded-md p-3 text-base"
                    placeholder="Enter the project title"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                  />
                </div>

                {/* Course Selection */}
                <div className="form-group">
                  <label
                    htmlFor="course"
                    className="block text-base font-medium text-teal"
                  >
                    Select Course
                  </label>
                  <select
                    id="course"
                    className="mt-2 block w-full border border-gray-300 rounded-md p-3 text-base"
                    value={course}
                    onChange={handleCourseChange}
                  >
                    <option value="">Select a course</option>
                    {/* Dynamically generate options from cardContent */}
                    {cardContent.map((course, index) => (
                      <option key={index} value={course.courseCode}>
                        {`${course.courseCode} - ${course.courseDescription}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Project Overview */}
              <div className="form-group">
                <label
                  htmlFor="project-overview"
                  className="block text-base font-medium text-teal"
                >
                  Project Overview
                </label>
                <textarea
                  id="project-overview"
                  rows="4"
                  className="mt-2 block w-full border border-gray-300 rounded-md p-3 text-base"
                  placeholder="Provide an overview of the project"
                  value={projectOverview}
                  onChange={(e) => setProjectOverview(e.target.value)}
                />
              </div>

              {/* Possible Features Grid */}
              <div className="form-group">
                <h3 className="text-lg font-semibold text-teal mb-4">
                  Possible Features
                </h3>

                {/* Grid Layout for Title and Description */}
                <div className="grid grid-cols-2 gap-8">
                  {/* Feature 1 */}
                  <div>
                    <label
                      htmlFor="feature-title-1"
                      className="block text-base font-medium text-teal"
                    >
                      Feature Title
                    </label>
                    <input
                      type="text"
                      id="feature-title-1"
                      className="mt-2 block w-full border border-gray-300 rounded-md p-3 text-base"
                      placeholder="Feature title"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="feature-description-1"
                      className="block text-base font-medium text-teal"
                    >
                      Feature Description
                    </label>
                    <input
                      type="text"
                      id="feature-description-1"
                      className="mt-2 block w-full border border-gray-300 rounded-md p-3 text-base"
                      placeholder="Feature description"
                    />
                  </div>

                  {/* Feature 2 */}
                  <div>
                    <input
                      type="text"
                      id="feature-title-2"
                      className="mt-2 block w-full border border-gray-300 rounded-md p-3 text-base"
                      placeholder="Feature title"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      id="feature-description-2"
                      className="mt-2 block w-full border border-gray-300 rounded-md p-3 text-base"
                      placeholder="Feature description"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="flex ml-auto bg-teal text-white px-6 py-3 rounded-md hover:bg-peach transition text-md"
              >
                Submit Proposal
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectProposal;
