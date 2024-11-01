import React from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";
import cardContent from "../../../card-content";
import { GROUPS } from "../../../table-content";
import Table from "../MembersTable/MembersTable";
import Guidelines from "./Guidelines";
import CourseGroupInfo from "./Components/CourseGroupInfo";

const ClassPage = () => {
  const { courseCode } = useParams();
  const course = cardContent.find((course) => course.courseCode === courseCode);
  const group = GROUPS.find((g) => g.groupName === course.group);

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <CourseGroupInfo />

        <Guidelines />

        {group && (
          <>
            <div className="members-table flex justify-center mt-16">
              <Table members={group.members} />
            </div>
            <div className="evaluate-btn flex mt-14">
              <Link
                to={`/class/${courseCode}/evaluate-peers`}
                className="ml-auto w-1/6 h-1/4 bg-teal text-white rounded-lg p-4 text-sm text-center hover:bg-peach"
              >
                Evaluate Peers
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClassPage;
