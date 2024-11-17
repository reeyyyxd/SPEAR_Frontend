import React from "react";

const AdviserCard = ({ name, fieldOfInterest, isSelected, onSelect }) => {
  return (
    <div
      className={`adviser-card rounded-lg overflow-hidden shadow-lg cursor-pointer mb-4 
      ${isSelected ? "text-teal" : "border"}`} // Change the border if selected
      onClick={onSelect}
    >
      <div
        className={`h-20 flex items-center justify-center ${
          isSelected ? "bg-peach text-white" : "bg-teal text-white"
        }`}
      >
        <h2 className="text-xl font-bold text-white">{name}</h2>
      </div>
      <div className="p-6 text-teal">
        <p className="text-base mt-4">{fieldOfInterest}</p>
      </div>
    </div>
  );
};

export default AdviserCard;
