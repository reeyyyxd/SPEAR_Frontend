import React from "react";

const ClassCard = ({ courseCode, courseDescription, onClick, bgColor }) => {
  return (
    <div
      className="card rounded-lg overflow-hidden shadow-lg bg-white cursor-pointer"
      onClick={onClick}
    >
      <div className={`h-32 flex items-center justify-center ${bgColor}`}>
        {/* Display course code */}
        <h2 className="text-2xl font-bold text-white">{courseCode}</h2>
      </div>
      <div className="p-8 text-teal">
        {/* Display course description */}
        <p className="text-base mt-4">{courseDescription}</p>
      </div>
    </div>
  );
};

export default ClassCard;
