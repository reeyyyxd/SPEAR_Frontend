import React from "react";
import { useParams } from "react-router-dom";
import cardContent from "../../../../statics/card-content";
import { GROUPS } from "../../../../statics/table-content";

const CourseGroupInfo = () => {
  const { courseCode } = useParams(); // Get course code from URL
  const course = cardContent.find((course) => course.courseCode === courseCode);
  const group = course
    ? GROUPS.find((g) => g.groupName === course.group)
    : null;

  // Handle case where course does not exist
  if (!course) {
    return <p>Course not found</p>;
  }

  return (
    <div className="header mb-6">
      <h1 className="group-name text-2xl font-semibold mb-2">
        {group ? group.groupName : "No group assigned"}
      </h1>
      <p className="class-code-with-desc">
        {course.courseCode} - {course.courseDescription}
      </p>
    </div>
  );
};

export default CourseGroupInfo;
