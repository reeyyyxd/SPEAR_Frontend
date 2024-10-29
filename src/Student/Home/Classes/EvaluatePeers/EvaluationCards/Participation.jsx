import React from "react";
import { Card, Typography } from "@material-tailwind/react";

const Participation = () => {
  // Sample data for the attendance table
  const attendanceData = [
    { name: "John Doe", date: "2024-10-01", status: "Present" },
    { name: "Jane Smith", date: "2024-10-01", status: "Absent" },
    { name: "Sam Wilson", date: "2024-10-01", status: "Present" },
    { name: "Anna Taylor", date: "2024-10-01", status: "Late" },
  ];

  return (
    <div className="presentation my-8">
      <div className="my-4 font-semibold text-lg">Presentation</div>

      <Card className="h-full w-full overflow-hidden rounded-2xl">
        <table className="w-full min-w-max table-auto text-left rounded-lg">
          <thead className="bg-teal text-white">
            <tr>
              <th className="border-b border-white p-4">
                <Typography variant="h6" className="font-normal leading-none">
                  Name
                </Typography>
              </th>
              <th className="border-b border-white p-4">
                <Typography variant="h6" className="font-normal leading-none">
                  Date
                </Typography>
              </th>
              <th className="border-b border-white p-4">
                <Typography variant="h6" className="font-normal leading-none">
                  Status
                </Typography>
              </th>
              <th className="border-b border-white p-4">
                <Typography variant="h6" className="font-normal leading-none">
                  Action
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {attendanceData.map(({ name, date, status }, index) => {
              const rowClasses = `p-4 ${
                index === attendanceData.length - 1
                  ? ""
                  : "border-b border-blue-gray-50"
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
                      {date}
                    </Typography>
                  </td>
                  <td className={rowClasses}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {status}
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
    </div>
  );
};

export default Participation;
