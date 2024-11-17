import React from "react";

const Card = ({ courseCode, courseDescription, bgColor, onClick }) => {
  return (
    <div
      className="card rounded-lg overflow-hidden shadow-lg bg-white cursor-pointer"
      onClick={onClick}
    >
      <div className={`${bgColor} h-32 flex items-center justify-center`}>
        <h2 className="text-2xl font-bold text-white">{courseCode}</h2>
      </div>
      <div className="p-8 text-teal">
        <p className="text-base mt-4">{courseDescription}</p>
      </div>
    </div>
  );
};

export default Card;
