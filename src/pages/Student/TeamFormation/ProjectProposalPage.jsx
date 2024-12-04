import React, { useContext, useState, useEffect } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import ClassService from "../../../services/ClassService";
import ProjectProposalService from "../../../services/ProjectProposalService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProjectProposalPage = () => {
  const { authState } = useContext(AuthContext);
  const [enrolledClasses, setEnrolledClasses] = useState([]); // Store fetched classes
  const [selectedClass, setSelectedClass] = useState(""); // Selected class
  const [projectTitle, setProjectTitle] = useState("");
  const [projectOverview, setProjectOverview] = useState("");
  const [isCapstone, setIsCapstone] = useState(false); // Track if the course is a capstone
  const [features, setFeatures] = useState([
    { title: "", description: "" },
    { title: "", description: "" },
  ]); // Array to handle multiple features
  const navigate = useNavigate(); // For routing

  // Fetch Enrolled Classes
  useEffect(() => {
    const fetchEnrolledClasses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await ClassService.getClassesForStudent(
          authState.uid,
          token
        );
        setEnrolledClasses(response || []); // Set enrolled classes
      } catch (error) {
        console.error("Error fetching enrolled classes:", error);
        toast.error("Failed to fetch enrolled classes.");
      }
    };
    fetchEnrolledClasses();
  }, [authState.uid]);

  // Handle Class Selection
  const handleClassChange = (e) => {
    const selectedClassId = e.target.value;
    setSelectedClass(selectedClassId);

    const selectedClassInfo = enrolledClasses.find(
      (cls) => cls && cls.cid && cls.cid.toString() === selectedClassId
    );

    if (selectedClassInfo && selectedClassInfo.course_type === "Capstone") {
      setIsCapstone(true);
    } else {
      setIsCapstone(false);
    }
  };

  // Handle Feature Change
  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...features];
    updatedFeatures[index][field] = value;
    setFeatures(updatedFeatures);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClass) {
      toast.error("Please select a class.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authorized.");
      return;
    }

    const proposalData = {
      proposedById: parseInt(authState.uid),
      projectName: projectTitle,
      description: projectOverview,
      classId: parseInt(selectedClass), // Ensure this is an integer
      features: features
        .filter((feature) => feature.title.trim() && feature.description.trim())
        .map((feature) => ({
          featureTitle: feature.title,
          featureDescription: feature.description,
        })),
    };

    if (isCapstone) {
      const adviserId = 12; // Replace with dynamic selection if needed
      proposalData.adviserId = parseInt(adviserId);
    }

    console.log(
      "Submitting Proposal Data:",
      JSON.stringify(proposalData, null, 2)
    );

    try {
      const response = await ProjectProposalService.createProposal(
        proposalData,
        token
      );
      toast.success("Proposal submitted successfully!");
      navigate("/team-formation/project-proposal/proposal-summary");
    } catch (error) {
      console.error(
        "Error submitting proposal:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Failed to submit the proposal."
      );
    }
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      {/* Sidebar */}
      <Navbar userRole={authState.role} />

      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="welcome">
          <h1 className="text-3xl font-semibold my-6">Project Proposal</h1>

          {/* Project Proposal Form */}
          <div className="form-field">
            <form className="space-y-10" onSubmit={handleSubmit}>
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
                  required
                />
              </div>

              {/* Class Selection */}
              <div className="form-group">
                <label
                  htmlFor="class-selection"
                  className="block text-base font-medium text-teal"
                >
                  Select Class
                </label>
                <select
                  id="class-selection"
                  className="mt-2 block w-full border border-gray-300 rounded-md p-3 text-base"
                  value={selectedClass}
                  onChange={handleClassChange}
                  required
                >
                  <option value="">Select a class</option>
                  {enrolledClasses.map((cls) => (
                    <option key={cls.cid} value={cls.cid}>
                      {cls.courseCode} - {cls.courseDescription} ({cls.section})
                    </option>
                  ))}
                </select>
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
                  required
                />
              </div>

              {isCapstone && (
                <div className="form-group">
                  <label
                    htmlFor="adviser-selection"
                    className="block text-base font-medium text-teal"
                  >
                    Select Adviser
                  </label>
                  <select
                    id="adviser-selection"
                    className="mt-2 block w-full border border-gray-300 rounded-md p-3 text-base"
                    value={adviserId}
                    onChange={(e) => setAdviserId(e.target.value)}
                    required
                  >
                    <option value="">Select an adviser</option>
                    {/* Replace with dynamic adviser list */}
                    <option value="12">Dr. Smith</option>
                    <option value="13">Dr. Doe</option>
                  </select>
                </div>
              )}

              {/* Possible Features Grid */}
              <div className="form-group">
                <h3 className="text-lg font-semibold text-teal mb-4">
                  Possible Features
                </h3>

                {/* Dynamic Feature Inputs */}
                <div className="grid grid-cols-2 gap-8">
                  {features.map((feature, index) => (
                    <React.Fragment key={index}>
                      <div>
                        <label
                          htmlFor={`feature-title-${index}`}
                          className="block text-base font-medium text-teal"
                        >
                          Feature Title
                        </label>
                        <input
                          type="text"
                          id={`feature-title-${index}`}
                          className="mt-2 block w-full border border-gray-300 rounded-md p-3 text-base"
                          placeholder="Feature title"
                          value={feature.title}
                          onChange={(e) =>
                            handleFeatureChange(index, "title", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`feature-description-${index}`}
                          className="block text-base font-medium text-teal"
                        >
                          Feature Description
                        </label>
                        <input
                          type="text"
                          id={`feature-description-${index}`}
                          className="mt-2 block w-full border border-gray-300 rounded-md p-3 text-base"
                          placeholder="Feature description"
                          value={feature.description}
                          onChange={(e) =>
                            handleFeatureChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </React.Fragment>
                  ))}
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

export default ProjectProposalPage;
