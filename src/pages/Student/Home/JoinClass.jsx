import React, { useState } from "react";
import cardContent from "../../../statics/card-content";

const JoinClass = ({ isOpen, onClose }) => {
  const [classCode, setClassCode] = useState(""); // State to store the class code
  const [filteredCourse, setFilteredCourse] = useState(null); // State to store the filtered course

  if (!isOpen) return null; // Don't render the modal if it's not open

  // Handle the input change
  const handleInputChange = (event) => {
    const { value } = event.target;
    setClassCode(value);

    // Filter the course based on the class code
    const course = cardContent.find((course) => course.classCode === value);
    setFilteredCourse(course || null); // Update the filtered course
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl relative p-8">
        {" "}
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          &times; {/* You can replace this with an icon if preferred */}
        </button>
        {/* Modal Content */}
        <h2 className="text-xl font-semibold mb-4">Join Class</h2>
        <p>
          Please enter the class code provided by the teacher and click on the
          join class button.
        </p>
        <form className="mt-4">
          <input
            type="text"
            placeholder="Class Code"
            value={classCode}
            onChange={handleInputChange} // Add the onChange handler
            className="border rounded-lg p-2 w-full mb-4"
          />
          <button
            className={`bg-teal text-white rounded-lg p-2 w-full ${
              !filteredCourse ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!filteredCourse} // Disable button if no course is selected
          >
            Join
          </button>
        </form>
        {/* Display filtered course if available */}
        {filteredCourse && (
          <div
            className={`mt-4 bg-gray-100 p-4 rounded-lg ${filteredCourse.bgColor}`}
          >
            <h3 className="font-semibold">{filteredCourse.courseCode}</h3>
            <p>{filteredCourse.courseDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinClass;
