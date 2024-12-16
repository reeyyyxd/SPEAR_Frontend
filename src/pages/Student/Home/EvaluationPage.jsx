import React from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import Guidelines from "../../../components/Statics/Guidelines";

const EvaluationPage = () => {
  const { authState } = React.useContext(AuthContext);

  const groupMembers = [
    { name: "Lindsey Stroud", avatar: "/path/to/avatar1.png" },
    { name: "Sarah Brown", avatar: "/path/to/avatar2.png" },
    { name: "Micheal Owen", avatar: "/path/to/avatar3.png" },
    { name: "Mary Jane", avatar: "/path/to/avatar4.png" },
    { name: "Peter Dodle", avatar: "/path/to/avatar5.png" },
  ];

  const renderEvaluationTable = () => (
    <div className="mb-6">
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full border rounded-md">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="py-2 px-4">Member</th>
              {[
                ...Array(10).fill().map((_, i) => 10 - i), // Numbers 10 to 1
                "NA1", "NA2", "NA3", // Additional columns
              ].map((label, i) => (
                <th key={i} className="py-2 px-4 text-center">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groupMembers.map((member, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="py-2 px-4 text-left">{member.name}</td>
                {[
                  ...Array(10).fill(), // 10 checkboxes for numbers 10 to 1
                  "NA1", "NA2", "NA3", // Additional checkboxes for NA1, NA2, NA3
                ].map((_, i) => (
                  <td key={i} className="text-center py-2">
                    <input type="checkbox" className="w-4 h-4" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      {/* Navbar */}
      <Navbar userRole={authState.role} />

      {/* Main Content */}
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="mb-8">
          <Guidelines />
        </div>

        {/* Attendance Section */}
        <div className="mb-8">
          <h1 className="text-lg font-semibold mt-16">Attendance</h1>
          <p className="text-gray-600 mb-4">
            Members have a complete attendance record for all scheduled meetings.
          </p>
          {renderEvaluationTable()}
        </div>

        {/* Presentation Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Presentation</h2>
          <p className="text-gray-600 mb-4">
            Members provided high-quality and useful presentations during meetings.
          </p>
          {renderEvaluationTable()}
        </div>

        {/* Participation Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Participation</h2>
          <p className="text-gray-600 mb-4">
           Member is actively participating during brainstorming and discussions.
          </p>
          {renderEvaluationTable()}
        </div>

        {/* Respect Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Respect</h2>
          <p className="text-gray-600 mb-4">
          Member respects everyone's opinions.
          </p>
          {renderEvaluationTable()}
        </div>
      
        {/* Promptness  Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Promptness </h2>
          <p className="text-gray-600 mb-4">
          Member is able to meet deadlines for work in progress & submissions.
          </p>
          {renderEvaluationTable()}
        </div>
      
        {/* Execution Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Execution</h2>
          <p className="text-gray-600 mb-4">
           Member is contributing to project execution & achievement.
          </p>
          {renderEvaluationTable()}
        </div>
      
        {/* Report Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Report</h2>
          <p className="text-gray-600 mb-4">
          Member is contributing to report writing.
          </p>
          {renderEvaluationTable()}
        </div>

        {/* Initiative Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Initiative</h2>
          <p className="text-gray-600 mb-4">
          Member is demonstrating leadership or initiative.
          </p>
          {renderEvaluationTable()}
        </div>

        {/* Creativeness  Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Creativeness </h2>
          <p className="text-gray-600 mb-4">
          Member has a creative approach.
          </p>
          {renderEvaluationTable()}
        </div>
        
        {/* Knowledge  Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Knowledge </h2>
          <p className="text-gray-600 mb-4">
          Member understands the necessary concepts and requirements of the project.
          </p>
          {renderEvaluationTable()}
        </div>
      

        {/* Next Button */}
         <div className="text-right">
          <button  className="w-1/6 h-1/4 ml-4 bg-teal text-white rounded-lg p-4 text-sm text-center hover:bg-peach mx-2">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationPage;
