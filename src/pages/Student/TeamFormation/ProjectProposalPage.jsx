import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import { toast } from "react-toastify";

const ProjectProposalPage = () => {
  const { authState, getDecryptedId } = useContext(AuthContext);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectOverview, setProjectOverview] = useState("");
  const [features, setFeatures] = useState([{ title: "", description: "" }]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedClassId = getDecryptedId("cid");
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
      features: features
        .filter((feature) => feature.title.trim() && feature.description.trim())
        .map((feature) => ({
          featureTitle: feature.title.trim(),
          featureDescription: feature.description.trim(),
        })),
    };

    console.log("Submitting Proposal Data:", proposalData);

    try {
      const response = await fetch("http://localhost:8080/student/create-proposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify(proposalData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit the proposal.");
      }

      toast.success("Proposal submitted successfully!");
      navigate("/student-dashboard");
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast.error(error.message || "Failed to submit the proposal.");
    }
  };

  const handleAddFeature = () => {
    setFeatures([...features, { title: "", description: "" }]);
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
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
            <button
              type="button"
              onClick={handleAddFeature}
              className=" text-white bg-teal px-4 py-2 my-4 rounded-md border hover:bg-teal-dark transition"
            >
              Add Feature
            </button>
            <div className="grid gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Feature title"
                    className="flex-1 border border-gray-300 rounded-md p-3"
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
                    className="flex-1 border border-gray-300 rounded-md p-3"
                    value={feature.description}
                    onChange={(e) => {
                      const updatedFeatures = [...features];
                      updatedFeatures[index].description = e.target.value;
                      setFeatures(updatedFeatures);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-red-500 border border-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition"
                  >
                    Remove
                  </button>
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
