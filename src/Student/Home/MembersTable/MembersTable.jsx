import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import { TABLE_HEAD } from "../../../table-content";

const Table = ({ members = [] }) => {
  return (
    <Card className="h-full w-full overflow-hidden rounded-2xl">
      <table className="w-full min-w-max table-auto text-left rounded-lg">
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
          {members.map(({ name, job, date }) => (
            <tr key={name} className="hover:bg-peach hover:text-white">
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
                  {job}
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {date}
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
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
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default Table;
