import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../services/AuthContext";

const StudentEvaluation = () => {
  const { getDecryptedId } = useContext(AuthContext);
  const navigate = useNavigate();
  const address = window.location.hostname;

  const [questions, setQuestions] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [responses, setResponses] = useState({});

  const studentId = getDecryptedId("uid");
  const evaluationId = getDecryptedId("eid");
  const classId = getDecryptedId("cid");

  const STORAGE_KEY = `eval-${evaluationId}-class-${classId}`;

    useEffect(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setResponses(JSON.parse(saved));
        } catch (err) {
          console.warn("Failed to parse saved responses", err);
        }
      }
    }, []); 

    useEffect(() => {
      if (Object.keys(responses).length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
      }
    }, [responses]);

  useEffect(() => {
    fetchQuestions();
    fetchTeamMembers();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`http://${address}:8080/get-questions-by-evaluation/${evaluationId}`);
      setQuestions(response.data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(`http://${address}:8080/evaluation/${studentId}/class/${classId}/team`);
      if (!Array.isArray(response.data.memberIds) || !Array.isArray(response.data.memberNames)) {
        console.error("Unexpected response format for team members:", response.data);
        return;
      }
      const members = response.data.memberIds.map((id, index) => ({
        memberId: id,
        memberName: response.data.memberNames[index]
      }));
      setTeamMembers(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const handleResponseChange = (memberId, questionId, rawValue) => {
    // Text questions come through with memberId === "text"
    if (memberId === "text") {
      setResponses({
        ...responses,
        [`text-${questionId}`]: rawValue,
      });
      return;
    }
  
    // Otherwise it’s a numeric response
    let value = rawValue === "" ? "" : parseFloat(rawValue);
    if (!isNaN(value)) {
      value = Math.min(Math.max(value, 0), 10);
    }
    setResponses({
      ...responses,
      [`${memberId}-${questionId}`]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // 1) Confirm
    const confirmed = window.confirm(
      "Are you sure you want to submit your evaluation? You won't be able to make changes after this."
    );
    if (!confirmed) return;
  
    // 2) Validate every question is answered & in-range
    for (const question of questions) {
      if (question.questionType === "INPUT") {
        for (const member of teamMembers) {
          const key = `${member.memberId}-${question.qid}`;
          const value = responses[key];
          if (
            value === "" ||
            value === undefined ||
            isNaN(value) ||
            value < 0 ||
            value > 10
          ) {
            alert(
              `Please enter a valid score between 0 and 10 for "${question.questionTitle}"`
            );
            return;
          }
        }
      } else if (question.questionType === "TEXT") {
        const textValue = responses[`text-${question.qid}`];
        if (!textValue || textValue.trim() === "") {
          alert(`Please answer the text question: "${question.questionTitle}"`);
          return;
        }
      }
    }
  
    // 3) Prevent same score for all members, except for "Attendance"
    for (const question of questions) {
      if (
        question.questionType === "INPUT" &&
        question.questionTitle.trim().toLowerCase() !== "attendance"
      ) {
        const scores = teamMembers.map((m) =>
          responses[`${m.memberId}-${question.qid}`]
        );
        const uniqueCount = new Set(scores).size;
        if (uniqueCount === 1) {
          alert(
            `You cannot assign the same score to all members for "${question.questionTitle}"`
          );
          return;
        }
      }
    }
  
    // 4) Build payload and submit
    const responseList = [];
    teamMembers.forEach((member) => {
      questions.forEach((question) => {
        if (question.questionType === "INPUT") {
          responseList.push({
            evaluator: { uid: studentId },
            evaluatee: { uid: member.memberId },
            question: { qid: question.qid },
            evaluation: { eid: evaluationId },
            score: responses[`${member.memberId}-${question.qid}`],
            textResponse: null,
          });
        }
      });
    });
    questions
      .filter((q) => q.questionType === "TEXT")
      .forEach((question) => {
        const textValue = responses[`text-${question.qid}`];
        responseList.push({
          evaluator: { uid: studentId },
          evaluatee: { uid: studentId },
          question: { qid: question.qid },
          evaluation: { eid: evaluationId },
          score: 0,
          textResponse: textValue,
        });
      });
  
    try {
      await axios.post(
        `http://${address}:8080/responses/submit?teamId=${classId}`,
        responseList
      );
      alert("Evaluation successfully submitted!");
      localStorage.removeItem(STORAGE_KEY); // if you’re using draft autosave
      navigate(-1);
    } catch (error) {
      console.error("Error submitting evaluation:", error);
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

    <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Evaluation</h1>
    <p className="text-md text-gray-500 mb-6">Evaluate your team members carefully.</p>

    <form className="w-full max-w-6xl bg-white p-6 md:p-8 rounded-lg shadow space-y-8">

      {teamMembers.length > 0 && (
            <>
            <div className="mb-4 text-sm text-gray-500">
            <p className="mb-2">
              Rate each team member on a scale of <code>0.0</code> – <code>10</code> for each question.{' '}
              <span className="italic text-gray-500">(Except for Attendance, if available)</span>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                No member can have exactly the same score for every item as any other member.
              </li>
              <li>
                Every inputs and text must be filled out.
              </li>
              <li>
                All team members should be able to complete the evaluation table.
              </li>
            </ul>
          </div>

            <div className="overflow-x-auto space-y-4">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="sticky left-0 bg-gray-100 p-3 text-left z-10 w-52 border-r border-gray-300">
                  Team Member
                </th>
                {questions
                  .filter((q) => q.questionType === "INPUT")
                  .map((question, index) => (
                    <th
                      key={question.qid}
                      className={`text-center p-3 min-w-[180px] border-r border-gray-200 ${
                        index > 3 ? "hidden lg:table-cell" : ""
                      }`}
                    >
                      <div className="font-bold text-xs">
                          {question.questionTitle}
                        </div>

                        {question.questionDetails && question.questionDetails !== question.questionTitle && (
                          <div
                            className="mt-1 text-[10px] text-gray-500 line-clamp-2"
                            title={question.questionDetails}
                          >
                            {question.questionDetails}
                          </div>
                        )}
                    </th>
                  ))}
                <th className="sticky right-0 bg-gray-100 p-3 text-center z-10 min-w-[100px] border-l border-gray-300">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {teamMembers.map((member) => {
                const memberInputs = questions.filter(q => q.questionType === "INPUT");
                const total = memberInputs.reduce((acc, q) => {
                  const val = parseFloat(responses[`${member.memberId}-${q.qid}`]) || 0;
                  return acc + val;
                }, 0);

                return (
                  <tr key={member.memberId} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="sticky left-0 bg-white z-0 p-3 font-medium text-gray-700 w-52 border-r border-gray-200">
                      {member.memberName}
                    </td>

                    {memberInputs.map((question, index) => (
                      <td
                        key={question.qid}
                        className={`p-3 text-center border-r border-gray-100 ${
                          index > 3 ? "hidden lg:table-cell" : ""
                        }`}
                      >
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          placeholder="0.0"
                          className="w-20 text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
                          value={responses[`${member.memberId}-${question.qid}`] || ""}
                          onChange={(e) => {
                            const raw = e.target.value;
                            // allow blank
                            if (raw === "") {
                              handleResponseChange(member.memberId, question.qid, "");
                              return;
                            }
                            let num = parseFloat(raw);
                            if (isNaN(num)) return;
                            // clamp between 0 and 10
                            num = Math.min(Math.max(num, 0), 10);
                            handleResponseChange(member.memberId, question.qid, num);
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
    

      {questions.filter(q => q.questionType === "TEXT").map((question) => (
        <div key={question.qid} className="space-y-2">
          <div>
            <div className="font-semibold text-gray-800">{question.questionTitle}</div>
            <div className="text-sm text-gray-500">{question.questionDetails}</div>
          </div>
          <textarea
            rows="4"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-gray-400"
            placeholder="Write your response here..."
            value={responses[`text-${question.qid}`] || ""}
            onChange={(e) => handleResponseChange("text", question.qid, e.target.value)}
          />
        </div>
      ))}
    </div>
  )}
<div className="flex justify-end mt-10">
      <button
        type="submit"
        onClick={handleSubmit}
        className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 transition"
      >
        Submit Evaluation
      </button>
    </div>  


    </form>
  </div>
);
};

export default StudentEvaluation;
