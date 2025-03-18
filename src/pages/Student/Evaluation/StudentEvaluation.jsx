import React from "react";
import { useNavigate } from "react-router-dom";

const StudentEvaluation = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Student Evaluation</h1>
      <p className="text-lg text-gray-600 mb-4">Evaluate your team members here.</p>

      {/* Replace with actual evaluation form */}
      <form className="w-1/2 bg-white p-6 shadow-md rounded-md">
        <label className="block text-gray-700 mb-2">Evaluation Criteria:</label>
        <textarea className="w-full p-2 border border-gray-300 rounded-md" placeholder="Write your evaluation..."></textarea>

        <button
          type="submit"
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-800 transition"
        >
          Submit Evaluation
        </button>
      </form>

      <button
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition"
        onClick={() => navigate(-1)} // Go back to previous page
      >
        Finish Evaluation
      </button>
    </div>
  );
};

export default StudentEvaluation;