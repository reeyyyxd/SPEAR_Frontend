import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../services/AuthContext";

const TeacherAdviserEvaluation = () => {
  const { getDecryptedId } = useContext(AuthContext);
  const navigate = useNavigate();
  const address = window.location.hostname;

  // State for teams and pagination
  const [teams, setTeams] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // State for questions and responses
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [validationErrors, setValidationErrors] = useState(null);

  const evaluationId = getDecryptedId("eid");
  const teacherId = getDecryptedId("uid");
  const classId = getDecryptedId("cid") || "default"; // Add classId for storage key
  
  // Define storage key for local storage
  const STORAGE_KEY = `eval-${evaluationId}-class-${classId}`;

  useEffect(() => {
    fetchTeamDetailsByAdviser();
    fetchQuestions();
    
    // Load responses from localStorage if available
    const savedResponses = localStorage.getItem(STORAGE_KEY);
    if (savedResponses) {
      setResponses(JSON.parse(savedResponses));
    }
  }, []);
  
  // Save responses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
  }, [responses]);

  // Fetch all teams for this adviser
  const fetchTeamDetailsByAdviser = async () => {
    try {
      const response = await axios.get(
        `http://${address}:8080/teacher/teams/adviser/${teacherId}`
      );
      setTeams(response.data);
    } catch (err) {
      console.error("Failed to fetch team details:", err);
    }
  };

  // Fetch evaluation questions
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `http://${address}:8080/get-questions-by-evaluation/${evaluationId}`
      );
      setQuestions(response.data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Helper function to get team info by index
  const getTeamInfo = (index) => {
    const team = teams[index] || {};
    const memberNames = team.leaderName
      ? [team.leaderName, ...(team.memberNames || [])]
      : team.memberNames || [];
    const memberIds = team.memberIds || [];
    
    return {
      team,
      memberNames,
      memberIds
    };
  };

  // Current team being evaluated
  const currentTeam = teams[currentIndex] || {};
  // Combine leader and members
  const combinedMemberNames = currentTeam.leaderName
    ? [currentTeam.leaderName, ...(currentTeam.memberNames || [])]
    : currentTeam.memberNames || [];
  const combinedMemberIds = currentTeam.memberIds || [];

  // Handle input changes
  const handleResponseChange = (memberId, questionId, value) => {
    // Cap numerical values at 10
    if (typeof value === 'number' && !isNaN(value)) {
      value = Math.min(value, 10);
    }
    
    setResponses({
      ...responses,
      [`${memberId}-${questionId}`]: value,
    });
    
    // Clear any validation errors
    setValidationErrors(null);
  };

  // Validation function for a single team
  const validateTeam = (teamIndex) => {
    const { team, memberIds } = getTeamInfo(teamIndex);
    const errors = [];
    
    if (!team || !team.tid) {
      return [`Invalid team at index ${teamIndex}`];
    }
    
    const inputQuestions = questions.filter(q => q.questionType === "INPUT");
    
    // Check if all input questions are answered
    for (const memberId of memberIds) {
      for (const question of inputQuestions) {
        const key = `${memberId}-${question.qid}`;
        const value = responses[key];
        
        // Check if value is undefined, empty, not a number, or outside range (0-10]
        if (value === undefined || value === "" || isNaN(value) || value <= 0 || value > 10) {
          errors.push(`Team ${teamIndex + 1} (${team.groupName}): Missing or invalid score for question "${question.questionTitle}"`);
        }
      }
    }
    
    // Check for unique scores (except Attendance)
    for (const question of inputQuestions) {
      // Skip the uniqueness check for attendance questions
      if (question.questionTitle.toLowerCase().includes("attendance")) {
        continue;
      }
      
      const scoresForQuestion = [];
      for (const memberId of memberIds) {
        const key = `${memberId}-${question.qid}`;
        const value = responses[key];
        
        if (value !== undefined && value !== "" && !isNaN(value)) {
          // Check if this score already exists
          if (scoresForQuestion.includes(parseFloat(value))) {
            errors.push(`Team ${teamIndex + 1} (${team.groupName}): For "${question.questionTitle}", each student must have a unique score.`);
            break;
          }
          
          scoresForQuestion.push(parseFloat(value));
        }
      }
    }
    
    // Check text questions
    const textQuestions = questions.filter(q => q.questionType === "TEXT");
    for (const question of textQuestions) {
      const key = `text-${question.qid}-team-${team.tid}`;
      const value = responses[key];
      if (!value || !value.trim()) {
        errors.push(`Team ${teamIndex + 1} (${team.groupName}): Missing answer for text question "${question.questionTitle}"`);
      }
    }
    
    return errors;
  };
  
  // Validate all teams
  const validateAllTeams = () => {
    if (!teams || teams.length === 0) {
      return ["No teams available to evaluate"];
    }
    
    let allErrors = [];
    
    for (let i = 0; i < teams.length; i++) {
      const teamErrors = validateTeam(i);
      allErrors = [...allErrors, ...teamErrors];
    }
    
    return allErrors;
  };

  // Pagination controls with validation
  const nextTeam = () => {
    // Validate current team before proceeding
    const errors = validateTeam(currentIndex);
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors(null);
    setCurrentIndex((i) => Math.min(i + 1, teams.length - 1));
  };
  
  const prevTeam = () => {
    setValidationErrors(null);
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
  
    const allErrors = validateAllTeams();
  
    if (allErrors.length > 0) {
      setValidationErrors(allErrors);
      return;
    }
  
    if (!window.confirm(
      "Are you sure you want to submit your evaluation? You won't be able to make changes after this."
    )) return;
  
    // Prepare adviser-to-student responseList
    const responseList = [];
  
    for (let teamIndex = 0; teamIndex < teams.length; teamIndex++) {
      const { team, memberIds } = getTeamInfo(teamIndex);
      const teamId = team.tid;  // Safe now because of your API
  
      // For all INPUT Questions (scoring)
      const inputQuestions = questions.filter(q => q.questionType === "INPUT");
      for (const memberId of memberIds) {
        for (const question of inputQuestions) {
          const key = `${memberId}-${question.qid}`;
          const value = responses[key];
  
          responseList.push({
            evaluator: { uid: teacherId },   // Teacher (Adviser)
            evaluatee: { uid: memberId },     // Student being evaluated
            question: { qid: question.qid },
            evaluation: { eid: evaluationId },
            team: { teamId },
            score: value,
            textResponse: null,
          });
        }
      }
  
      // For all TEXT Questions (feedback per TEAM)
      const textQuestions = questions.filter(q => q.questionType === "TEXT");
      for (const question of textQuestions) {
        const key = `text-${question.qid}-team-${teamId}`;
        const value = responses[key];
  
        responseList.push({
          evaluator: { uid: teacherId },
          evaluatee: { uid: teacherId },  // Adviser evaluating the team as a whole (self-text)
          question: { qid: question.qid },
          evaluation: { eid: evaluationId },
          team: { teamId },
          score: 0,
          textResponse: value,
        });
      }
    }
  
    try {
      await axios.post(
        `http://${address}:8080/responses/submit-adviser?evaluationId=${evaluationId}&evaluatorId=${teacherId}&classId=${classId}`,
        responseList
      );
      alert("Evaluation successfully submitted!");
  
      localStorage.removeItem(STORAGE_KEY);
      navigate(-1);
    } catch (error) {
      console.error("Error submitting adviser evaluation:", error);
      alert("Failed to submit evaluation.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="w-full max-w-6xl mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          ← Back
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Adviser to Student Evaluation</h1>
      <p className="text-md text-gray-500 mb-6">Evaluate your students based on the criteria below.</p>

      {/* Team Project Details */}
      {currentTeam && (
        <div className="w-full max-w-6xl bg-white p-6 md:p-8 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {currentTeam.groupName} - {currentTeam.projectName}
            </h2>
            <div className="text-sm text-gray-500">
              Advised Team {currentIndex + 1} of {teams.length}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-semibold text-gray-700">Project Description</h3>
              <p className="text-gray-600">{currentTeam.projectDescription}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Schedule</h3>
              <p className="text-gray-600">{currentTeam.scheduleDay}, {currentTeam.scheduleTime}</p>
            </div>
          </div>

          {currentTeam.features && currentTeam.features.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Features</h3>
              <div className="space-y-2">
                {currentTeam.features.map((feature, idx) => (
                  <div key={idx} className="border border-gray-200 p-3 rounded">
                    <p className="font-medium text-gray-700">{feature.featureTitle}</p>
                    <p className="text-sm text-gray-600">{feature.featureDescription}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors && validationErrors.length > 0 && (
        <div className="w-full max-w-6xl bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <h3 className="text-red-700 font-medium mb-2">Encounters:</h3>
          <ul className="list-disc ml-5 text-sm text-red-600">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-6xl bg-white p-6 md:p-8 rounded-lg shadow space-y-8">
        {combinedMemberNames.length > 0 && (
          <>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-sm text-blue-700 font-medium">Requirements:</p>
              <ul className="list-disc ml-5 text-sm text-blue-600">
                <li>Rate each student on a scale of 0.1 - 10.0 for each question (scores of 0 are not allowed).</li>
                <li>All fields must be filled with valid scores between 0.1 and 10.0.</li>
                <li>Each student must have a unique score for each question (except for Attendance).</li>
                <li>Written feedback must be provided for all text questions.</li>
                <li>All teams must be fully evaluated before submission.</li>
              </ul>
            </div>

            <div className="overflow-x-auto space-y-4">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-sm">
                    <th className="sticky left-0 bg-gray-100 p-3 text-left z-10 w-52 border-r border-gray-300">
                      Student
                    </th>
                    {questions.filter(q => q.questionType === "INPUT").map((q, index) => (
                      <th
                        key={q.qid}
                        className={`text-center p-3 min-w-[180px] border-r border-gray-200 ${index > 3 ? "hidden lg:table-cell" : ""}`}
                      >
                        <div className="font-semibold text-xs">{q.questionTitle}</div>
                        <div className="text-[10px] text-gray-500">{q.questionDetails}</div>
                      </th>
                    ))}
                    <th className="sticky right-0 bg-gray-100 p-3 text-center z-10 min-w-[100px] border-l border-gray-300">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {combinedMemberNames.map((member, idx) => {
                    const memberId = combinedMemberIds[idx];
                    const inputQs = questions.filter(q => q.questionType === "INPUT");
                    const total = inputQs.reduce(
                      (sum, q) => sum + (parseFloat(responses[`${memberId}-${q.qid}`]) || 0),
                      0
                    );

                    return (
                      <tr key={member + idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="sticky left-0 bg-white z-0 p-3 font-medium text-gray-700 w-52 border-r border-gray-200">
                          {member}
                        </td>
                        {inputQs.map((q, i) => (
                          <td
                            key={q.qid}
                            className={`p-3 text-center border-r border-gray-100 ${i > 3 ? "hidden lg:table-cell" : ""}`}
                          >
                            <input
                              type="number"
                              min="0.1"
                              max="10"
                              step="0.1"
                              placeholder="0.0"
                              className="w-20 text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              value={responses[`${memberId}-${q.qid}`] || ""}
                              onChange={e => {
                                const value = parseFloat(e.target.value);
                                // If value is greater than 10, cap it at 10
                                const cappedValue = !isNaN(value) ? Math.min(value, 10) : value;
                                handleResponseChange(memberId, q.qid, cappedValue);
                              }}
                            />
                          </td>
                        ))}
                        <td className="sticky right-0 bg-white z-0 text-center font-semibold border-l border-gray-200">
                          {total.toFixed(1)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {questions.filter(q => q.questionType === "TEXT").length > 0 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-700 mt-10">Written Feedback</h2>
            {questions.filter(q => q.questionType === "TEXT").map(q => (
              <div key={q.qid} className="space-y-2">
                <div className="font-semibold text-gray-800">{q.questionTitle}</div>
                <div className="text-sm text-gray-500">{q.questionDetails}</div>
                <textarea
                  rows="4"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-gray-400"
                  placeholder="Write your response here..."
                  value={responses[`text-${q.qid}-team-${currentTeam.tid}`] || ""}
                  onChange={e => handleResponseChange(`text-${q.qid}-team`, currentTeam.tid, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Progress indicator */}
        <div className="w-full bg-gray-200 h-2 rounded-full mt-6">
          <div 
            className="bg-blue-500 h-2 rounded-full" 
            style={{ width: `${((currentIndex + 1) / teams.length) * 100}%` }}
          ></div>
        </div>

        {/* Pagination and Submit Controls - with consistent button styling */}
        <div className="flex justify-between mt-10">
          <button
            type="button"
            onClick={prevTeam}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-[#323c47] text-white rounded hover:bg-[#323c47] transition disabled:opacity-50"
          >
            Previous
          </button>

          {currentIndex < teams.length - 1 ? (
            <button
              type="button" 
              onClick={nextTeam}
              className="px-4 py-2 bg-[#323c47] text-white rounded hover:bg-[#323c47] transition disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Submit Evaluation
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TeacherAdviserEvaluation;