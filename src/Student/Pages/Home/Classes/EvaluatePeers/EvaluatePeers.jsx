import React from "react";
import Attendance from "./EvaluationCards/Attendance";
import CourseGroupInfo from "../Components/CourseGroupInfo";
import Presentation from "./EvaluationCards/Presentation";
import Participation from "./EvaluationCards/Participation";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../../../Components/Navbar/Navbar";

const EvaluatePeers = () => {
  const { courseCode } = useParams(); // Get course code from URL

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        {/* Course and group information */}
        <CourseGroupInfo />

        {/* Attendance component */}
        <div className="members-table justify-center mt-16">
          <Attendance />
          <Attendance />
          <Attendance />
          <Attendance />
          <Attendance />
          <Attendance />
          <Attendance />
          <Attendance />
          <Attendance />
          <Attendance />
        </div>

        <div className="submit-btn flex my-8">
          <Link
            to={`/class/${courseCode}/`} // Dynamic route with courseCode
            className="ml-auto w-1/6 h-1/4 bg-teal text-white rounded-lg p-4 text-sm text-center hover:bg-peach"
          >
            Submit Evaluation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EvaluatePeers;
