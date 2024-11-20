import React from "react";
import { useFetchUsers } from "../../components/CustomHooks/useFetchUsers";
import { usePagination } from "../../components/CustomHooks/usePagination";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import UserService from "../../services/UserService";

const UsersTable = () => {
  const { users, error, isLoading, mutate } = useFetchUsers();
  const usersPerPage = 10;

  const {
    currentItems: currentUsers,
    totalPages,
    visiblePageNumbers,
    currentPage,
    setCurrentPage,
  } = usePagination(users, usersPerPage);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await UserService.deleteUser(userId);
        mutate(
          users.filter((user) => user.uid !== userId),
          false
        );
        alert("User deleted successfully.");
      } catch (err) {
        alert("Failed to delete the user.");
      }
    }
  };

  if (isLoading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error.message}</p>;
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="p-2 min-w-full inline-block align-middle">
          <div className="overflow-hidden rounded-lg border border-gray-300">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-teal font-medium text-white">
                  {["Name", "Email", "Role", "Action"].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-6 py-2 text-start text-md font-medium"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-100">
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-teal-800">
                      {`${user.firstname} ${user.lastname}`}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-teal-800">
                      {user.email}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-teal-800">
                      {user.role}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-start text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => handleDelete(user.uid)}
                        className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <img src={deleteIcon} alt="delete-icon" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="text-center text-gray-500 py-4">No users found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-2 mr-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border text-teal hover:bg-peach hover:text-white disabled:text-white disabled:border-none disabled:bg-gray-200"
          >
            Previous
          </button>

          {visiblePageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-4 py-2 border rounded-lg mx-1 ${
                currentPage === number
                  ? "bg-teal text-white"
                  : "text-teal hover:bg-peach hover:text-white"
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg text-teal hover:bg-peach hover:text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
