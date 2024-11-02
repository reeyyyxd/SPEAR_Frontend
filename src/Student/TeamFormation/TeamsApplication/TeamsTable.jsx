import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import { TABLE_HEAD } from "./teams-table";
import { useNavigate } from "react-router-dom";

const TeamsTable = ({ Team = [] }) => {
  const navigate = useNavigate();

  const handleRowClick = (teamName) => {
    navigate(`/team-application/project-summary`, { state: { teamName } });
  };

  return (
    <Card className="h-auto w-full overflow-hidden rounded-2xl mt-16">
      <table className="w-full min-w-max table-auto text-center rounded-lg">
        <thead className="bg-teal text-white">
          <tr>
            {TABLE_HEAD.map((head) => (
              <th key={head} className="border-b border-white p-4">
                <Typography variant="h6" className="font-normal leading-none">
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-100">
          {Team.map(({ name, title, members }) => (
            <tr
              key={name}
              className="hover:bg-peach hover:text-white cursor-pointer"
              onClick={() => handleRowClick(name)} // Handle row click
            >
              <td className="p-4 border-b border-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {name}
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {title}
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal text-green-400"
                >
                  {members}
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default TeamsTable;
