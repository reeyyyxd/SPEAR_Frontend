import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../services/AuthContext";

const StudentEvaluation = () => {
  const { getDecryptedId } = useContext(AuthContext);
  const navigate = useNavigate();
  const address = window.location.hostname;

  const [questions, setQuestions] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]); // Ensure it's an array
  const [responses, setResponses] = useState({});

  const studentId = getDecryptedId("uid");
  const evaluationId = getDecryptedId("eid");
  const classId = getDecryptedId("cid");

  useEffect(() => {
    fetchQuestions();
    fetchTeamMembers();
  }, []);

  // Fetch Questions by Evaluation ID
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`http://${address}:8080/get-questions-by-evaluation/${evaluationId}`);
      setQuestions(response.data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Fetch Team Members
  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(`http://${address}:8080/evaluation/${studentId}/class/${classId}/team`);
      //console.log("Team Members Response:", response.data);
  
      if (!Array.isArray(response.data.memberIds) || !Array.isArray(response.data.memberNames)) {
        console.error("Unexpected response format for team members:", response.data);
        return;
      }
  
      // Transform the response into an array of objects
      const members = response.data.memberIds.map((id, index) => ({
        memberId: id,
        memberName: response.data.memberNames[index]
      }));
  
      setTeamMembers(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  // Handle Radio & Text Inputs
  const handleResponseChange = (memberId, questionId, value) => {
    setResponses({
      ...responses,
      [`${memberId}-${questionId}`]: value,
    });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    //console.log("Submitted Responses:", responses);
    alert("Evaluation Submitted!");

    try {
      await axios.post(`http://${address}:8080/submit-evaluation`, {
        studentId,
        evaluationId,
        responses,
      });

      alert("Evaluation successfully submitted!");
      navigate(-1);
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      alert("Failed to submit evaluation.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Student Evaluation</h1>
      <p className="text-lg text-gray-600 mb-6">Evaluate your team members here.</p>

      {/* Evaluation Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white p-6 shadow-md rounded-md">
        {questions.map((question) => (
          <div key={question.qid} className="mb-6">
            <h2 className="font-semibold text-lg text-gray-700">{question.questionText}</h2>

            {/* Radio Type Question (Rating 1-5) */}
            {question.questionType === "RADIO" && teamMembers.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse mt-2">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-2"></th>
                      {[1, 2, 3, 4, 5].map((score) => (
                        <th key={score} className="p-2 text-center">{score}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => (
                      <tr key={member.memberId} className="border-b">
                        <td className="p-2 font-semibold">{member.memberName}</td>
                        {[1, 2, 3, 4, 5].map((score) => (
                          <td key={score} className="p-2 text-center">
                            <input
                              type="radio"
                              name={`rating-${member.memberId}-${question.qid}`}
                              value={score}
                              checked={responses[`${member.memberId}-${question.qid}`] === score}
                              onChange={() => handleResponseChange(member.memberId, question.qid, score)}
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

export default StudentEvaluation;