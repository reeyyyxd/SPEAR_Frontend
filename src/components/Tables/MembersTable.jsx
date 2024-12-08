import React from "react";

const MembersTable = () => {
  // Static table headings and members data
  const TABLE_HEAD = ["Name", "Role", "Date", "Actions"];
  const members = [
    { name: "Alice Johnson", role: "Software Engineer", date: "2023-01-10" },
    { name: "Bob Smith", role: "Project Manager", date: "2023-02-15" },
    { name: "Charlie Brown", role: "Designer", date: "2023-03-20" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-300 shadow-md mt-16">
      <table className="w-full table-auto text-left">
        {/* Table Head */}
        <thead className="bg-teal text-white">
          <tr>
            {TABLE_HEAD.map((head) => (
              <th key={head} className="p-4 text-sm font-semibold">
                {head}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="bg-gray-100">
          {members.map(({ name, role, date }) => (
            <tr key={name} className="hover:bg-peach hover:text-white">
              <td className="p-4 border-b border-gray-300 text-sm">{name}</td>
              <td className="p-4 border-b border-gray-300 text-sm">{role}</td>
              <td className="p-4 border-b border-gray-300 text-sm">{date}</td>
              <td className="p-4 border-b border-gray-300 text-sm">
                <a
                  href="#"
                  className="text-blue-600 hover:underline hover:text-blue-800"
                >
                  Edit
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MembersTable;
