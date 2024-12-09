import React, { useContext, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import ProjectProposalService from "../../../services/ProjectProposalService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProjectProposalPage = () => {
  const { authState, getDecryptedId } = useContext(AuthContext);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectOverview, setProjectOverview] = useState("");
  const [features, setFeatures] = useState([
    { title: "", description: "" },
    { title: "", description: "" },
  ]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedClassId = getDecryptedId("cid"); // Retrieve stored class ID
    if (!storedClassId) {
      toast.error(
        "Class ID not found. Please return to the class page and try again."
      );
      return;
    }

    const proposalData = {
      proposedById: parseInt(authState.uid, 10),
      projectName: projectTitle.trim(),
      description: projectOverview.trim(),
      classId: parseInt(storedClassId, 10),
      features: features.filter(
        (feature) => feature.title.trim() && feature.description.trim()
      ),
    };

    try {
      await ProjectProposalService.createProposal(
        proposalData,
        authState.token
      );
      toast.success("Proposal submitted successfully!");
      navigate("/class-summary");
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
      <Navbar userRole={authState.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <h1 className="text-3xl font-semibold my-6">Project Proposal</h1>
        <form className="space-y-10" onSubmit={handleSubmit}>
          <div>
            <label className="block text-base font-medium text-teal">
              Project Title
            </label>
            <input
              type="text"
              className="block w-full border border-gray-300 rounded-md p-3"
              placeholder="Enter project title"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-base font-medium text-teal">
              Project Overview
            </label>
            <textarea
              rows="4"
              className="block w-full border border-gray-300 rounded-md p-3"
              placeholder="Describe your project"
              value={projectOverview}
              onChange={(e) => setProjectOverview(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-teal mb-4">Features</h3>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index}>
                  <input
                    type="text"
                    placeholder="Feature title"
                    className="block w-full border border-gray-300 rounded-md p-3 mb-2"
                    value={feature.title}
                    onChange={(e) => {
                      const updatedFeatures = [...features];
                      updatedFeatures[index].title = e.target.value;
                      setFeatures(updatedFeatures);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Feature description"
                    className="block w-full border border-gray-300 rounded-md p-3"
                    value={feature.description}
                    onChange={(e) => {
                      const updatedFeatures = [...features];
                      updatedFeatures[index].description = e.target.value;
                      setFeatures(updatedFeatures);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-teal text-white px-6 py-3 rounded-md hover:bg-teal-dark transition"
          >
            Submit Proposal
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectProposalPage;
