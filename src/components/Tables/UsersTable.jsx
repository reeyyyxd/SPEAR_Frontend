import React from "react";
import { usePagination } from "../../components/CustomHooks/usePagination";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import UserService from "../../services/UserService";

const UsersTable = ({ users }) => {
  const usersPerPage = 10;

  const {
    currentItems: currentUsers,
    totalPages,
    visiblePageNumbers,
    currentPage,
    setCurrentPage,
  } = usePagination(users, usersPerPage);

  const handleDelete = async (userEmail) => {
    const userToDelete = users.find((user) => user.email === userEmail);
    if (!userToDelete) {
      toast.error("User not found.");
      return;
    }
  
    const confirmationMessage = `Are you sure you want to delete ${userToDelete.firstname} ${userToDelete.lastname}?`;
    const confirmDeletion = window.confirm(confirmationMessage);
  
  
    if (!confirmDeletion) {
      toast.info("Deletion cancelled.");
      return;
    }
  
    try {
      await UserService.deleteUser(userEmail);
      alert("User deleted successfully.");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete the user.");
    }
  };

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
                <tr key={user.email} className="hover:bg-gray-100">
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
                      onClick={() => handleDelete(user.email)}
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