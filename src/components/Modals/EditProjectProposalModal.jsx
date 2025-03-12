import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../services/AuthContext";

const EditProjectProposalModal = ({ isOpen, proposalId, onClose, refreshProposals }) => {
  const { authState } = useContext(AuthContext);
  const [proposalData, setProposalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  const address = window.location.hostname;

  useEffect(() => {
    if (isOpen && proposalId) {
      fetchProposalDetails();
    }
  }, [isOpen, proposalId]);

  const fetchProposalDetails = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const token = authState.token;
      if (!token) throw new Error("No auth token");

      const response = await axios.get(`http://${address}:8080/proposals/${proposalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProposalData({
        projectName: response.data.projectName || "",
        description: response.data.description || "",
        features: response.data.features || [],
      });
    } catch (error) {
      setErrorMessage("Failed to load proposal data. Please try again.");
      console.error("Error fetching proposal:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProposalData({ ...proposalData, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (index, field, value) => {
    setProposalData((prev) => {
      const updatedFeatures = [...prev.features];
      updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
      return { ...prev, features: updatedFeatures };
    });
  };

  const handleAddFeature = () => {
    setProposalData((prev) => ({
      ...prev,
      features: [...prev.features, { featureTitle: "", featureDescription: "" }],
    }));
  };

  const handleRemoveFeature = (index) => {
    setProposalData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateProposal = async () => {
    try {
        const token = authState.token;
        if (!token) throw new Error("No auth token");

        const payload = {
            userId: parseInt(authState.uid, 10),
            projectName: proposalData.projectName,
            description: proposalData.description,
            features: proposalData.features.map(f => ({
                featureTitle: f.featureTitle,
                featureDescription: f.featureDescription,
            })),
        };

        const proposalIdInt = parseInt(proposalId, 10);

        await axios.put(
            `http://${address}:8080/student/update-proposal/${proposalIdInt}`,
            payload,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        alert("Proposal updated successfully!");
        refreshProposals();
        onClose();
    } catch (error) {
        console.error("Error updating proposal:", error.response?.data || error.message);
        alert(error.response?.data?.error || "Failed to update proposal.");
    }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-md w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Edit Proposal</h2>

        {loading ? (
          <p className="text-gray-600">Loading proposal data...</p>
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <>
            <label className="block text-sm font-medium">Project Name</label>
            <input
              type="text"
              name="projectName"
              value={proposalData.projectName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-3"
            />

            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={proposalData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-3"
            ></textarea>

            <label className="block text-sm font-medium">Features</label>
            {proposalData.features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Feature Title"
                  value={feature.featureTitle}
                  onChange={(e) => handleFeatureChange(index, "featureTitle", e.target.value)}
                  className="w-1/2 p-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Feature Description"
                  value={feature.featureDescription}
                  onChange={(e) => handleFeatureChange(index, "featureDescription", e.target.value)}
                  className="w-1/2 p-2 border rounded-md"
                />
                <button
                  onClick={() => handleRemoveFeature(index)}
                  className="text-red-500 px-2 hover:text-red-700"
                >
                  ✖
                </button>
              </div>
            ))}

            <button
              onClick={handleAddFeature}
              className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition mb-3"
            >
              Add Feature
            </button>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handleUpdateProposal}
              >
                Save Changes
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditProjectProposalModal;