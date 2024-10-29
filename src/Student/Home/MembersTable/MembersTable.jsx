import React, { useMemo } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom"; // Use React Router for navigation
import { TABLE_HEAD } from "../../../table-content";

const Table = ({ members = [] }) => {
  const navigate = useNavigate(); // Hook for navigation

  // Memoize the table headers for efficiency
  const tableHeaders = useMemo(() => {
    return TABLE_HEAD.map((head) => (
      <th key={head} className="border-b border-white p-4">
        <Typography variant="h6" className="font-normal leading-none">
          {head}
        </Typography>
      </th>
    ));
  }, []);

  // Redirect to team formation page
  const handleRedirect = () => {
    navigate("/team-formation");
  };

  // Show fallback if no members are present
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Typography variant="h5" className="text-center mb-4">
          This group currently has no members. Please proceed to the team
          formation page.
        </Typography>
        <Button
          variant="filled"
          color="teal"
          size="lg"
          onClick={handleRedirect}
        >
          Go to Team Formation Page
        </Button>
      </div>
    );
  }

  return (
    <Card className="h-full w-full overflow-hidden rounded-2xl">
      <table className="w-full min-w-max table-auto text-left rounded-lg">
        <thead className="bg-teal text-white">
          <tr>{tableHeaders}</tr>
        </thead>
        <tbody className="bg-gray-100">
          {members.map(({ name, job, date }, index) => {
            const isLast = index === members.length - 1;
            const rowClasses = `p-4 ${
              isLast ? "" : "border-b border-blue-gray-50"
            }`;

            return (
              <tr key={name} className="hover:bg-peach hover:text-white">
                <td className={rowClasses}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {name}
                  </Typography>
                </td>
                <td className={rowClasses}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {job}
                  </Typography>
                </td>
                <td className={rowClasses}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {date}
                  </Typography>
                </td>
                <td className={rowClasses}>
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
  );
};

export default Table;
