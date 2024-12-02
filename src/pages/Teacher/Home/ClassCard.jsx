import React from "react";

const ClassCard = ({ courseCode, section, courseDescription, onClick }) => {
  return (
    <div
      className="card rounded-lg overflow-hidden shadow-lg bg-white cursor-pointer"
      onClick={onClick}
    >
      <div className={`h-32 flex items-center justify-center bg-teal`}>
        {/* Display course code */}
        <h2 className="text-2xl font-bold text-white">
          {courseCode} - {section}
        </h2>
      </div>
      <div className="p-8 text-teal">
        {/* Display course description */}
        <p className="text-base mt-4">{courseDescription}</p>
      </div>
    </div>
  );
};

export default ClassCard;
