import React from "react";
import { useNavigate } from "react-router-dom";

const TeacherAdviserEvaluation = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Team Evaluation</h1>
      <p className="text-lg text-gray-600 mb-4">Evaluate the team's performance here.</p>

      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition"
        onClick={() => navigate(-1)} // Navigate back to the evaluation status page
      >
        Finish Evaluation
      </button>
    </div>
  );
};

export default TeacherAdviserEvaluation;