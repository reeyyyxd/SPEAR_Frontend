import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../services/AuthContext";

const TeacherAdviserEvaluation = () => {
  const { getDecryptedId } = useContext(AuthContext);
  const navigate = useNavigate();
  const address = window.location.hostname;

  const [teamDetails, setTeamDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [feedback, setFeedback] = useState("");

  const teamName = "SPEAR"; // Change dynamically if needed
  const evaluationId = getDecryptedId("eid");

  useEffect(() => {
    fetchTeamDetails();
    fetchQuestions();
  }, []);

  // Fetch Team Project and Members
  const fetchTeamDetails = async () => {
    try {
      const response = await axios.get(`http://${address}:8080/evaluation/teacher/team-details/${teamName}`);
      setTeamDetails(response.data);
    } catch (error) {
      console.error("Error fetching team details:", error);
    }
  };

  // Fetch Questions by Evaluation ID
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`http://${address}:8080/get-questions-by-evaluation/${evaluationId}`);
      setQuestions(response.data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Handle Radio & Text Inputs
  const handleResponseChange = (memberId, questionId, value) => {
    setResponses({
      ...responses,
      [`${memberId}-${questionId}`]: value,
    });
  };

  // Handle Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(`http://${address}:8080/evaluation/teacher/submit`, {
        teamId: teamDetails?.teamId,
        projectId: teamDetails?.projectId,
        responses,
        feedback,
      });

      alert("Evaluation submitted successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      alert("Failed to submit evaluation.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Team Evaluation</h1>
      <p className="text-lg text-gray-600 mb-4">Evaluate the team's performance here.</p>

      {teamDetails && questions.length > 0 ? (
        <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white p-6 shadow-md rounded-md">
          <h2 className="text-xl font-semibold text-gray-800">Project Name: {teamDetails.projectName}</h2>
          <p className="text-gray-600 mb-4">Project Description: {teamDetails.projectDescription}</p>

          {/* Evaluation Questions */}
          {questions.map((question) => (
            <div key={question.qid} className="mb-6">
              <h3 className="font-semibold text-lg text-gray-700">{question.questionText}</h3>

              {/* Radio Type Question (Rating 1-5) */}
              {question.questionType === "RADIO" && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse mt-2">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="p-2 text-left">Team Member</th>
                        {[1, 2, 3, 4, 5].map((score) => (
                          <th key={score} className="p-2 text-center">{score}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {teamDetails.memberNames.map((member, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 font-semibold">{member}</td>
                          {[1, 2, 3, 4, 5].map((score) => (
                            <td key={score} className="p-2 text-center">
                              <input
                                type="radio"
                                name={`rating-${teamDetails.memberIds[index]}-${question.qid}`}
                                value={score}
                                checked={responses[`${teamDetails.memberIds[index]}-${question.qid}`] === score}
                                onChange={() => handleResponseChange(teamDetails.memberIds[index], question.qid, score)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Text Type Question (Essay) */}
              {question.questionType === "TEXT" && (
                <div className="mt-3">
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md"
                    rows="4"
                    placeholder="Write your response here..."
                    value={responses[`text-${question.qid}`] || ""}
                    onChange={(e) => handleResponseChange("text", question.qid, e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}

        
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-6 py-3 mt-6 rounded-md hover:bg-green-800 transition"
          >
            Submit Evaluation
          </button>
        </form>
      ) : (
        <p className="text-gray-500">Loading team details...</p>
      )}

      {/* Finish Button */}
      <button
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition"
        onClick={() => navigate(-1)}
      >
        Finish Evaluation
      </button>
    </div>
  );
};

export default TeacherAdviserEvaluation;