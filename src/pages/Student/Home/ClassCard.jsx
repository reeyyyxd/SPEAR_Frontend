import React from "react";

const ClassCard = ({
  courseCode,
  section,
  courseDescription,
  teacherName,
  onClick,
}) => {
  return (
    <div
      className="card rounded-lg overflow-hidden shadow-lg bg-white cursor-pointer hover:shadow-xl transition-shadow"
      onClick={onClick}
    >
      {/* Header Section with Course Code and Section */}
      <div className="h-32 flex items-center justify-center bg-teal">
        <h2 className="text-2xl font-bold text-white">
          {courseCode} - {section}
        </h2>
      </div>
      {/* Body Section with Course Description and Teacher Name */}
      <div className="p-8 text-teal">
        <p className="text-base mt-4">{courseDescription}</p>
        <p className="text-sm text-gray-600 mt-2">
          <strong>Teacher:</strong> {teacherName}
        </p>
      </div>
    </div>
  );
};

export default ClassCard;
