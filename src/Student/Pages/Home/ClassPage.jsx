import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import cardContent from "../../card-content";
import { Card, Typography } from "@material-tailwind/react";

const TABLE_HEAD = ["Name", "Role", "Added", ""];

const TABLE_ROWS = [
  {
    name: "John Michael",
    job: "Product Manager",
    date: "23/04/18",
  },
  {
    name: "Alexa Liras",
    job: "Front-end Developer",
    date: "23/04/18",
  },
  {
    name: "Laurent Perrier",
    job: "Back-end Developer",
    date: "19/09/17",
  },
  {
    name: "Michael Levi",
    job: "UX/UI Designer",
    date: "24/12/08",
  },
  {
    name: "Richard Gran",
    job: "Full-stack developer",
    date: "04/10/21",
  },
];

const ClassPage = () => {
  const { courseCode } = useParams(); // Get the course code from the URL
  const course = cardContent.find((course) => course.courseCode === courseCode); // Find the course based on courseCode

  if (!course) {
    return <p>Course not found</p>; // Fallback in case the courseCode doesn't match any course
  }

  console.log("Course Code:", courseCode); // Debugging output
  console.log("Course found:", course); // Log the found course for debugging

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="welcome">
          <h1 className="group-name text-2xl font-semibold mb-2">GROUP 1 </h1>
          {/* Dynamically displaying the courseCode and courseDescription */}
          <p className="class-code-with-desc">
            {course.courseCode} - {course.courseDescription}
          </p>
        </div>
        <div className="guidelines">
          <p className="my-16">
            <span className="font-bold">Peer Evaluation</span> is the mechanism
            adopted from IE Department to provide equity to each member's effort
            to produce the research and/or project. This peer- and
            self-assessment tool is integrated in the computation of the
            per-group activity grade of each student as a multiplying factor to
            the corresponding team grade given by the Instructor.
          </p>
          <h1 className="text-lg font-semibold mt-16">Guidelines:</h1>
          <ol class="list-decimal ml-8">
            <li>
              Score for each criterion is within 1 to 10. The highest score is
              10.
            </li>
            <li>
              No member can have exactly the same score in each criterion with
              any other member of the team except for the Attendance.
            </li>
            <li>
              ALL members should be able to accomplish this Peer Evaluation Form
              as part of the deliverables.
            </li>
            <li>Use NA1, NA2 and NA3 for the excess members in the form.</li>
          </ol>
        </div>

        <div className="flex justify-center mt-16">
          <Card className="h-full w-full overflow-hidden rounded-2xl">
            <table className="w-full min-w-max table-auto text-left rounded-lg">
              <thead className="bg-teal text-white">
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th key={head} className="border-b border-white p-4">
                      <Typography
                        variant="medium"
                        className="font-normal leading-none"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-gray-100">
                {TABLE_ROWS.map(({ name, job, date }, index) => {
                  const isLast = index === TABLE_ROWS.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={name} className="hover:bg-peach hover:text-white">
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {name}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {job}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {date}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          as="a"
                          href="#"
                          variant="small"
                          color="blue-gray"
                          className="font-medium"
                        >
                          Edit
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
        <div className="flex mt-14">
        <button className="ml-auto w-1/6 h-1/4 bg-teal text-white rounded-lg p-4 text-sm hover:bg-peach">
            Evaluate Peers
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
