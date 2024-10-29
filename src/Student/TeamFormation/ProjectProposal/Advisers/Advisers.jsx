import React from "react";
import AdviserCard from "./AdviserCard";

const Advisers = ({ advisers, selectedAdviser, onSelectAdviser }) => {
  return (
    <div className="advisers-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {/* Map over the advisers prop to create AdviserCard components */}
      {advisers.map((adviser, index) => (
        <AdviserCard
          key={index}
          name={adviser.name}
          fieldOfInterest={adviser.fieldOfInterest}
          isSelected={selectedAdviser === adviser.name}
          onSelect={() => onSelectAdviser(adviser.name)}
        />
      ))}
    </div>
  );
};

export default Advisers;
